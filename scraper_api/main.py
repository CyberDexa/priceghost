"""
PriceGhost Scraper API - FastAPI server for crawl4ai
Deploy to Render.com free tier

Endpoints:
  POST /scrape
  Body: {"url": "...", "product_name": "..."}
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
import re
import json
import urllib.parse
from difflib import SequenceMatcher

app = FastAPI(title="PriceGhost Scraper API")

# Allow CORS from your Vercel app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://priceghost.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global crawler instance
crawler_instance = None

class ScrapeRequest(BaseModel):
    url: str
    product_name: Optional[str] = None

class ScrapeResponse(BaseModel):
    success: bool
    price: Optional[float] = None
    currency: Optional[str] = None
    title: Optional[str] = None
    image: Optional[str] = None
    error: Optional[str] = None

async def get_crawler():
    """Get or create crawler instance"""
    global crawler_instance
    if crawler_instance is None:
        from crawl4ai import AsyncWebCrawler, BrowserConfig
        browser_config = BrowserConfig(
            headless=True,
            verbose=False,
            viewport_width=1920,
            viewport_height=1080,
        )
        crawler_instance = AsyncWebCrawler(config=browser_config)
        await crawler_instance.__aenter__()
    return crawler_instance

def similarity(a: str, b: str) -> float:
    """Calculate string similarity"""
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def parse_price(price_str: str) -> Optional[float]:
    """Parse price string to float"""
    if not price_str:
        return None
    cleaned = re.sub(r'[£$€¥]|GBP|USD|EUR|\s', '', price_str)
    cleaned = cleaned.replace(',', '')
    try:
        price = float(cleaned)
        return price if price > 1 else None
    except ValueError:
        return None

def detect_amazon_domain(url: str) -> tuple[str, str]:
    """Detect Amazon domain and currency"""
    domain_map = {
        'amazon.co.uk': ('amazon.co.uk', 'GBP'),
        'amazon.com': ('amazon.com', 'USD'),
        'amazon.de': ('amazon.de', 'EUR'),
        'amazon.fr': ('amazon.fr', 'EUR'),
        'amazon.ca': ('amazon.ca', 'CAD'),
    }
    for key, val in domain_map.items():
        if key in url:
            return val
    return ('amazon.com', 'USD')

async def scrape_amazon(url: str, product_name: str) -> dict:
    """Scrape Amazon via search"""
    from crawl4ai import CrawlerRunConfig, CacheMode, JsonCssExtractionStrategy
    
    if not product_name:
        return {"success": False, "error": "product_name required for Amazon"}
    
    domain, currency = detect_amazon_domain(url)
    crawler = await get_crawler()
    
    encoded_name = urllib.parse.quote(product_name)
    search_url = f"https://www.{domain}/s?k={encoded_name}"
    
    schema = {
        "name": "AmazonSearch",
        "baseSelector": "[data-component-type='s-search-result']",
        "fields": [
            {"name": "asin", "selector": "", "type": "attribute", "attribute": "data-asin"},
            {"name": "title", "selector": "h2 span, h2 a span", "type": "text"},
            {"name": "price", "selector": ".a-price .a-offscreen", "type": "text"},
            {"name": "image", "selector": ".s-image", "type": "attribute", "attribute": "src"},
        ]
    }
    
    config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        delay_before_return_html=3.0,
        extraction_strategy=JsonCssExtractionStrategy(schema=schema),
    )
    
    result = await crawler.arun(url=search_url, config=config)
    
    if result.success and result.extracted_content:
        products = json.loads(result.extracted_content)
        
        # Find best matching product
        best_match = None
        best_score = 0
        
        for p in products:
            price = parse_price(p.get('price', ''))
            title = p.get('title', '')
            if not price or 'Check each' in title:
                continue
                
            score = similarity(product_name, title)
            if score > best_score:
                best_score = score
                best_match = {"price": price, "title": title, "image": p.get('image')}
        
        if best_match:
            return {
                "success": True,
                "price": best_match["price"],
                "currency": currency,
                "title": best_match["title"],
                "image": best_match["image"],
            }
    
    return {"success": False, "error": "Could not find product"}

@app.get("/")
async def root():
    return {"status": "ok", "service": "PriceGhost Scraper API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/scrape", response_model=ScrapeResponse)
async def scrape(request: ScrapeRequest):
    """Scrape price from URL"""
    url = request.url.lower()
    
    if 'amazon.' in url:
        result = await scrape_amazon(request.url, request.product_name)
    else:
        # For non-Amazon sites, return error - use your existing scraper
        return ScrapeResponse(
            success=False,
            error="Only Amazon scraping supported. Use your existing scraper for other sites."
        )
    
    return ScrapeResponse(**result)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
