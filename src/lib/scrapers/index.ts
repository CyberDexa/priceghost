import * as cheerio from "cheerio";
import { ScrapeResult, Retailer } from "@/types";

// Detect retailer from URL
export function detectRetailer(url: string): Retailer {
  const hostname = new URL(url).hostname.toLowerCase();
  
  if (hostname.includes("amazon")) return "amazon";
  if (hostname.includes("walmart")) return "walmart";
  if (hostname.includes("bestbuy")) return "bestbuy";
  if (hostname.includes("target")) return "target";
  if (hostname.includes("ebay")) return "ebay";
  if (hostname.includes("costco")) return "costco";
  
  return "unknown";
}

// Parse price string to number
function parsePrice(priceStr: string | undefined): number | null {
  if (!priceStr) return null;
  
  // Remove currency symbols and clean up
  const cleaned = priceStr
    .replace(/[^0-9.,]/g, "")
    .replace(/,/g, "");
  
  const price = parseFloat(cleaned);
  return isNaN(price) ? null : price;
}

// Amazon scraper
async function scrapeAmazon(html: string, url: string): Promise<ScrapeResult> {
  const $ = cheerio.load(html);
  
  // Product name
  const name = $("#productTitle").text().trim() ||
    $("h1.product-title-word-break").text().trim() ||
    $("h1 span").first().text().trim();
  
  // Price - Amazon has multiple price locations
  const priceStr = 
    $(".a-price .a-offscreen").first().text() ||
    $("#priceblock_ourprice").text() ||
    $("#priceblock_dealprice").text() ||
    $(".a-price-whole").first().text() ||
    $('[data-a-color="price"] .a-offscreen').first().text();
  
  // Image
  const imageUrl = 
    $("#landingImage").attr("src") ||
    $("#imgBlkFront").attr("src") ||
    $(".a-dynamic-image").first().attr("src") ||
    $("#main-image").attr("src");
  
  const price = parsePrice(priceStr);
  
  return {
    success: true,
    name: name || "Amazon Product",
    price,
    currency: "USD",
    image_url: imageUrl,
    retailer: "amazon",
  };
}

// Walmart scraper
async function scrapeWalmart(html: string, url: string): Promise<ScrapeResult> {
  const $ = cheerio.load(html);
  
  const name = $("h1.prod-ProductTitle").text().trim() ||
    $('[data-testid="product-title"]').text().trim() ||
    $("h1").first().text().trim();
  
  const priceStr = 
    $('[data-testid="price-wrap"] .f2').text() ||
    $(".price-characteristic").attr("content") ||
    $('[itemprop="price"]').attr("content");
  
  const imageUrl = 
    $('[data-testid="hero-image-container"] img').attr("src") ||
    $(".hover-zoom-hero-image").attr("src");
  
  return {
    success: true,
    name: name || "Walmart Product",
    price: parsePrice(priceStr),
    currency: "USD",
    image_url: imageUrl,
    retailer: "walmart",
  };
}

// Best Buy scraper
async function scrapeBestBuy(html: string, url: string): Promise<ScrapeResult> {
  const $ = cheerio.load(html);
  
  const name = $(".sku-title h1").text().trim() ||
    $("h1").first().text().trim();
  
  const priceStr = 
    $('[data-testid="customer-price"] span').first().text() ||
    $(".priceView-customer-price span").first().text();
  
  const imageUrl = $(".primary-image").attr("src");
  
  return {
    success: true,
    name: name || "Best Buy Product",
    price: parsePrice(priceStr),
    currency: "USD",
    image_url: imageUrl,
    retailer: "bestbuy",
  };
}

// Target scraper
async function scrapeTarget(html: string, url: string): Promise<ScrapeResult> {
  const $ = cheerio.load(html);
  
  const name = $('[data-test="product-title"]').text().trim() ||
    $("h1").first().text().trim();
  
  const priceStr = $('[data-test="product-price"]').text();
  
  const imageUrl = $('[data-test="product-image"] img').attr("src");
  
  return {
    success: true,
    name: name || "Target Product",
    price: parsePrice(priceStr),
    currency: "USD",
    image_url: imageUrl,
    retailer: "target",
  };
}

// Generic scraper using Open Graph and JSON-LD
async function scrapeGeneric(html: string, url: string): Promise<ScrapeResult> {
  const $ = cheerio.load(html);
  
  // Try JSON-LD structured data first
  let jsonLd: any = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "");
      if (data["@type"] === "Product" || data?.["@graph"]?.find((i: any) => i["@type"] === "Product")) {
        jsonLd = data["@type"] === "Product" ? data : data["@graph"].find((i: any) => i["@type"] === "Product");
      }
    } catch {}
  });
  
  // Get name
  const name = 
    jsonLd?.name ||
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $("title").text().trim();
  
  // Get price from JSON-LD
  let price: number | null = null;
  if (jsonLd?.offers) {
    const offers = Array.isArray(jsonLd.offers) ? jsonLd.offers[0] : jsonLd.offers;
    price = parseFloat(offers?.price) || null;
  }
  
  // Fallback price detection
  if (!price) {
    const pricePatterns = [
      $('[class*="price"]').first().text(),
      $('[data-price]').attr("data-price"),
      $('[itemprop="price"]').attr("content") || $('[itemprop="price"]').text(),
    ];
    
    for (const p of pricePatterns) {
      const parsed = parsePrice(p);
      if (parsed) {
        price = parsed;
        break;
      }
    }
  }
  
  // Get image
  const imageUrl = 
    jsonLd?.image?.[0] || jsonLd?.image ||
    $('meta[property="og:image"]').attr("content") ||
    $('[itemprop="image"]').attr("src") ||
    $("img").first().attr("src");
  
  return {
    success: true,
    name: name || "Product",
    price,
    currency: "USD",
    image_url: imageUrl,
    retailer: "unknown",
  };
}

// Main scrape function
export async function scrapeProduct(url: string): Promise<ScrapeResult> {
  try {
    const retailer = detectRetailer(url);
    
    // Fetch with proper headers
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });
    
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch page: ${response.status}`,
      };
    }
    
    const html = await response.text();
    
    // Route to appropriate scraper
    switch (retailer) {
      case "amazon":
        return scrapeAmazon(html, url);
      case "walmart":
        return scrapeWalmart(html, url);
      case "bestbuy":
        return scrapeBestBuy(html, url);
      case "target":
        return scrapeTarget(html, url);
      default:
        return scrapeGeneric(html, url);
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape product",
    };
  }
}
