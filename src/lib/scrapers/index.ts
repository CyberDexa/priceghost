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
  if (hostname.includes("aliexpress")) return "aliexpress";
  if (hostname.includes("temu")) return "temu";
  if (hostname.includes("newegg")) return "newegg";
  if (hostname.includes("homedepot")) return "homedepot";
  if (hostname.includes("lowes")) return "lowes";
  if (hostname.includes("wayfair")) return "wayfair";
  if (hostname.includes("etsy")) return "etsy";
  if (hostname.includes("argos")) return "argos";
  if (hostname.includes("currys")) return "currys";
  if (hostname.includes("johnlewis")) return "johnlewis";
  if (hostname.includes("ao.com")) return "ao";
  if (hostname.includes("very.co.uk")) return "very";
  
  return "unknown";
}

// Detect currency from price string or page content
function detectCurrency(priceStr: string | undefined, html: string): string {
  if (!priceStr) return "USD";
  
  if (priceStr.includes("£") || priceStr.includes("GBP")) return "GBP";
  if (priceStr.includes("€") || priceStr.includes("EUR")) return "EUR";
  if (priceStr.includes("¥") || priceStr.includes("JPY") || priceStr.includes("CNY")) return "CNY";
  if (priceStr.includes("C$") || priceStr.includes("CAD")) return "CAD";
  if (priceStr.includes("A$") || priceStr.includes("AUD")) return "AUD";
  if (priceStr.includes("$")) return "USD";
  
  // Check page for currency indicators
  const $ = cheerio.load(html);
  const currencyMeta = $('meta[itemprop="priceCurrency"]').attr("content") ||
    $('[itemprop="priceCurrency"]').attr("content");
  if (currencyMeta) return currencyMeta;
  
  return "USD";
}

// Parse price string to number
function parsePrice(priceStr: string | undefined): number | undefined {
  if (!priceStr) return undefined;
  
  // Remove currency symbols and clean up
  const cleaned = priceStr
    .replace(/[^0-9.,]/g, "")
    .replace(/,/g, "");
  
  const price = parseFloat(cleaned);
  return isNaN(price) ? undefined : price;
}

// Get clean retailer name from URL for display
function getRetailerDisplayName(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    // Remove www. and common TLDs
    const cleanName = hostname
      .replace(/^www\./, "")
      .replace(/\.(com|co\.uk|co|net|org|io).*$/, "");
    
    // Capitalize first letter
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  } catch {
    return "Unknown";
  }
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

// AliExpress scraper
async function scrapeAliExpress(html: string, url: string): Promise<ScrapeResult> {
  const $ = cheerio.load(html);
  
  // Try to extract from JSON data embedded in page
  let productData: any = null;
  $("script").each((_, el) => {
    const content = $(el).html() || "";
    // Look for product data in various formats
    const patterns = [
      /window\.runParams\s*=\s*(\{[\s\S]+?\});/,
      /data:\s*(\{[\s\S]+?\}),\s*csrfToken/,
    ];
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        try {
          productData = JSON.parse(match[1]);
        } catch {}
      }
    }
  });
  
  // Get name from various sources
  const name = 
    productData?.data?.name ||
    productData?.pageModule?.title ||
    $('meta[property="og:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $(".product-title-text").text().trim();
  
  // Get price
  let priceStr = 
    productData?.data?.price ||
    productData?.priceModule?.formatedActivityPrice ||
    productData?.priceModule?.formatedPrice ||
    $('meta[property="product:price:amount"]').attr("content") ||
    $(".product-price-value").first().text() ||
    $('[class*="price"]').first().text();
  
  // Get image
  const imageUrl = 
    productData?.data?.image ||
    productData?.imageModule?.imagePathList?.[0] ||
    $('meta[property="og:image"]').attr("content") ||
    $(".magnifier-image").attr("src");
  
  const currency = detectCurrency(priceStr, html);
  
  return {
    success: true,
    name: cleanProductName(name) || "AliExpress Product",
    price: parsePrice(priceStr),
    currency,
    image_url: imageUrl,
    retailer: "aliexpress",
  };
}

// Temu scraper
async function scrapeTemu(html: string, url: string): Promise<ScrapeResult> {
  const $ = cheerio.load(html);
  
  // Temu often uses JSON-LD
  let jsonLd: any = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "");
      if (data["@type"] === "Product") {
        jsonLd = data;
      }
    } catch {}
  });
  
  // Get name
  const name = 
    jsonLd?.name ||
    $('meta[property="og:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $('[class*="title"]').first().text().trim();
  
  // Get price
  let price: number | undefined;
  if (jsonLd?.offers) {
    const offers = Array.isArray(jsonLd.offers) ? jsonLd.offers[0] : jsonLd.offers;
    price = parseFloat(offers?.price) || undefined;
  }
  
  if (!price) {
    const priceStr = 
      $('meta[property="product:price:amount"]').attr("content") ||
      $('[class*="price"]').first().text();
    price = parsePrice(priceStr);
  }
  
  // Get image
  const imageUrl = 
    jsonLd?.image?.[0] || jsonLd?.image ||
    $('meta[property="og:image"]').attr("content");
  
  const currency = jsonLd?.offers?.priceCurrency || 
    $('meta[property="product:price:currency"]').attr("content") || 
    "USD";
  
  return {
    success: true,
    name: cleanProductName(name) || "Temu Product",
    price,
    currency,
    image_url: imageUrl,
    retailer: "temu",
  };
}

// eBay scraper
async function scrapeEbay(html: string, url: string): Promise<ScrapeResult> {
  const $ = cheerio.load(html);
  
  const name = 
    $("h1.x-item-title__mainTitle span").text().trim() ||
    $('[data-testid="x-item-title"]').text().trim() ||
    $("h1").first().text().trim();
  
  const priceStr = 
    $('[data-testid="x-price-primary"] span').first().text() ||
    $(".x-price-primary span").first().text() ||
    $('[itemprop="price"]').attr("content");
  
  const imageUrl = 
    $('[data-testid="x-image-viewer"] img').attr("src") ||
    $(".ux-image-magnify__container img").attr("src") ||
    $('meta[property="og:image"]').attr("content");
  
  const currency = detectCurrency(priceStr, html);
  
  return {
    success: true,
    name: cleanProductName(name) || "eBay Product",
    price: parsePrice(priceStr),
    currency,
    image_url: imageUrl,
    retailer: "ebay",
  };
}

// Clean product name - remove store names and excessive whitespace
function cleanProductName(name: string | undefined): string {
  if (!name) return "";
  
  return name
    .replace(/\s*[\|\-–—]\s*(AliExpress|Temu|Amazon|eBay|Walmart|Target|Best Buy).*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200); // Limit length
}

// Generic scraper using Open Graph and JSON-LD - IMPROVED
async function scrapeGeneric(html: string, url: string): Promise<ScrapeResult> {
  const $ = cheerio.load(html);
  const retailerName = getRetailerDisplayName(url);
  
  // Try JSON-LD structured data first
  let jsonLd: any = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "");
      // Handle both direct Product and @graph array
      if (data["@type"] === "Product") {
        jsonLd = data;
      } else if (Array.isArray(data["@graph"])) {
        jsonLd = data["@graph"].find((i: any) => i["@type"] === "Product");
      } else if (Array.isArray(data)) {
        jsonLd = data.find((i: any) => i["@type"] === "Product");
      }
    } catch {}
  });
  
  // Get name from multiple sources
  let name = 
    jsonLd?.name ||
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $('meta[name="title"]').attr("content") ||
    $("h1").first().text().trim();
  
  // Fallback to title tag but clean it
  if (!name || name === "Product") {
    const pageTitle = $("title").text().trim();
    // Remove common suffixes like "| Store Name" or "- Store Name"
    name = pageTitle.replace(/\s*[\|\-–—:].+$/, "").trim();
  }
  
  // Get price from JSON-LD
  let price: number | undefined;
  let currency = "USD";
  
  if (jsonLd?.offers) {
    const offers = Array.isArray(jsonLd.offers) ? jsonLd.offers[0] : jsonLd.offers;
    price = parseFloat(offers?.price) || undefined;
    currency = offers?.priceCurrency || "USD";
  }
  
  // Try meta tags for price
  if (!price) {
    const metaPrice = $('meta[property="product:price:amount"]').attr("content") ||
      $('meta[property="og:price:amount"]').attr("content");
    if (metaPrice) {
      price = parseFloat(metaPrice);
      currency = $('meta[property="product:price:currency"]').attr("content") ||
        $('meta[property="og:price:currency"]').attr("content") || currency;
    }
  }
  
  // Fallback price detection with better selectors
  if (!price) {
    const priceSelectors = [
      '[itemprop="price"]',
      '[data-price]',
      '[class*="price"]:not([class*="compare"]):not([class*="was"]):not([class*="old"])',
      '[class*="Price"]:not([class*="compare"]):not([class*="was"]):not([class*="old"])',
      '[id*="price"]',
      '.price',
      '.product-price',
      '.current-price',
      '.sale-price',
    ];
    
    for (const selector of priceSelectors) {
      const el = $(selector).first();
      const priceText = el.attr("content") || el.attr("data-price") || el.text();
      const parsed = parsePrice(priceText);
      if (parsed && parsed > 0 && parsed < 100000) { // Reasonable price range
        price = parsed;
        currency = detectCurrency(priceText, html);
        break;
      }
    }
  }
  
  // Get image from multiple sources
  const imageUrl = 
    jsonLd?.image?.[0] || 
    (typeof jsonLd?.image === 'string' ? jsonLd.image : null) ||
    $('meta[property="og:image"]').attr("content") ||
    $('meta[property="og:image:secure_url"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    $('[itemprop="image"]').attr("src") ||
    $('[itemprop="image"]').attr("content") ||
    $('img[class*="product"]').first().attr("src") ||
    $('img[class*="main"]').first().attr("src");
  
  return {
    success: true,
    name: cleanProductName(name) || "Product",
    price,
    currency,
    image_url: imageUrl,
    retailer: retailerName.toLowerCase() as Retailer,
  };
}

// Main scrape function
export async function scrapeProduct(url: string): Promise<ScrapeResult> {
  try {
    const retailer = detectRetailer(url);
    
    // Fetch with proper headers - rotate user agents
    const userAgents = [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    ];
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
      redirect: "follow",
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
      case "aliexpress":
        return scrapeAliExpress(html, url);
      case "temu":
        return scrapeTemu(html, url);
      case "ebay":
        return scrapeEbay(html, url);
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
