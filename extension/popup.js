// PriceGhost Extension - Popup Script

const API_URL = "http://localhost:3000"; // Change to production URL when deploying

// DOM Elements
const loadingEl = document.getElementById("loading");
const authSectionEl = document.getElementById("auth-section");
const productSectionEl = document.getElementById("product-section");
const loginFormEl = document.getElementById("login-form");
const authErrorEl = document.getElementById("auth-error");
const userEmailEl = document.getElementById("user-email");
const logoutBtnEl = document.getElementById("logout-btn");
const signupBtnEl = document.getElementById("signup-btn");
const productCardEl = document.getElementById("product-card");
const noProductEl = document.getElementById("no-product");
const productImageEl = document.getElementById("product-image");
const productNameEl = document.getElementById("product-name");
const productPriceEl = document.getElementById("product-price");
const productRetailerEl = document.getElementById("product-retailer");
const targetPriceEl = document.getElementById("target-price");
const trackBtnEl = document.getElementById("track-btn");
const errorMessageEl = document.getElementById("error-message");
const successMessageEl = document.getElementById("success-message");
const alreadyTrackingEl = document.getElementById("already-tracking");
const dashboardLinkEl = document.getElementById("dashboard-link");

// State
let currentUser = null;
let currentProduct = null;
let currentTab = null;

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  dashboardLinkEl.href = `${API_URL}/dashboard`;
  
  // Check if user is logged in
  const session = await getStoredSession();
  
  if (session && session.access_token) {
    currentUser = session.user;
    showProductSection();
    await detectProduct();
  } else {
    showAuthSection();
  }
});

// Storage helpers
async function getStoredSession() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["session"], (result) => {
      resolve(result.session || null);
    });
  });
}

async function storeSession(session) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ session }, resolve);
  });
}

async function clearSession() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(["session"], resolve);
  });
}

// UI helpers
function showLoading() {
  loadingEl.style.display = "flex";
  authSectionEl.style.display = "none";
  productSectionEl.classList.remove("show");
}

function showAuthSection() {
  loadingEl.style.display = "none";
  authSectionEl.style.display = "block";
  productSectionEl.classList.remove("show");
}

function showProductSection() {
  loadingEl.style.display = "none";
  authSectionEl.style.display = "none";
  productSectionEl.classList.add("show");
  userEmailEl.textContent = currentUser?.email || "";
}

function showError(message) {
  authErrorEl.textContent = message;
  authErrorEl.classList.add("show");
}

function hideError() {
  authErrorEl.classList.remove("show");
}

function showProductError(message) {
  errorMessageEl.textContent = message;
  errorMessageEl.classList.add("show");
  successMessageEl.classList.remove("show");
}

function showProductSuccess() {
  successMessageEl.classList.add("show");
  errorMessageEl.classList.remove("show");
  trackBtnEl.disabled = true;
  trackBtnEl.textContent = "Added ✓";
}

// Auth handlers
loginFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loginBtn = document.getElementById("login-btn");
  
  loginBtn.disabled = true;
  loginBtn.textContent = "Signing in...";
  
  try {
    const response = await fetch(`${API_URL}/api/extension/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      await storeSession(data.session);
      currentUser = data.session.user;
      showProductSection();
      await detectProduct();
    } else {
      showError(data.error || "Invalid email or password");
    }
  } catch (error) {
    showError("Connection failed. Please try again.");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Sign In";
  }
});

signupBtnEl.addEventListener("click", () => {
  chrome.tabs.create({ url: `${API_URL}/signup` });
});

logoutBtnEl.addEventListener("click", async () => {
  await clearSession();
  currentUser = null;
  currentProduct = null;
  showAuthSection();
});

// Product detection
async function detectProduct() {
  productCardEl.style.display = "none";
  noProductEl.style.display = "none";
  
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;
    
    if (!tab?.url) {
      noProductEl.style.display = "block";
      return;
    }
    
    // Check if it's a supported retailer or product page
    const url = new URL(tab.url);
    const isProductPage = isLikelyProductPage(url);
    
    if (!isProductPage) {
      noProductEl.style.display = "block";
      return;
    }
    
    // Try to get product info from content script
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractProductInfo,
      });
      
      if (results && results[0]?.result) {
        currentProduct = results[0].result;
        currentProduct.url = tab.url;
        displayProduct(currentProduct);
        await checkIfAlreadyTracking(tab.url);
      } else {
        // Fallback to API scraping
        await scrapeViaAPI(tab.url);
      }
    } catch (scriptError) {
      // Content script failed, try API
      await scrapeViaAPI(tab.url);
    }
  } catch (error) {
    console.error("Detection error:", error);
    noProductEl.style.display = "block";
  }
}

function isLikelyProductPage(url) {
  const hostname = url.hostname.toLowerCase();
  const pathname = url.pathname.toLowerCase();
  
  // Check common retailers
  if (hostname.includes("amazon") && pathname.includes("/dp/")) return true;
  if (hostname.includes("amazon") && pathname.includes("/gp/product/")) return true;
  if (hostname.includes("walmart") && pathname.includes("/ip/")) return true;
  if (hostname.includes("bestbuy") && pathname.includes("/site/")) return true;
  if (hostname.includes("target") && pathname.includes("/-/A-")) return true;
  if (hostname.includes("ebay") && pathname.includes("/itm/")) return true;
  
  // Check for common product URL patterns
  if (pathname.includes("/product/")) return true;
  if (pathname.includes("/item/")) return true;
  if (pathname.includes("/p/")) return true;
  if (url.searchParams.has("product")) return true;
  
  return false;
}

// Extract product info from page (runs in content script context)
function extractProductInfo() {
  const result = {
    name: null,
    price: null,
    image: null,
    retailer: null,
  };
  
  // Detect retailer
  const hostname = window.location.hostname.toLowerCase();
  if (hostname.includes("amazon")) result.retailer = "amazon";
  else if (hostname.includes("walmart")) result.retailer = "walmart";
  else if (hostname.includes("bestbuy")) result.retailer = "bestbuy";
  else if (hostname.includes("target")) result.retailer = "target";
  else if (hostname.includes("ebay")) result.retailer = "ebay";
  else result.retailer = "unknown";
  
  // Try JSON-LD first
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of jsonLdScripts) {
    try {
      const data = JSON.parse(script.textContent);
      if (data["@type"] === "Product") {
        result.name = data.name;
        if (data.offers) {
          const offers = Array.isArray(data.offers) ? data.offers[0] : data.offers;
          result.price = parseFloat(offers.price);
        }
        if (data.image) {
          result.image = Array.isArray(data.image) ? data.image[0] : data.image;
        }
        break;
      }
    } catch {}
  }
  
  // Fallback to meta tags and selectors
  if (!result.name) {
    result.name = 
      document.querySelector('meta[property="og:title"]')?.content ||
      document.querySelector("#productTitle")?.textContent?.trim() ||
      document.querySelector("h1")?.textContent?.trim() ||
      document.title;
  }
  
  if (!result.price) {
    const priceSelectors = [
      ".a-price .a-offscreen",
      '[data-price]',
      ".price-current",
      '[class*="price"]',
    ];
    
    for (const selector of priceSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = el.getAttribute("data-price") || el.textContent;
        const match = text.match(/[\d,]+\.?\d*/);
        if (match) {
          result.price = parseFloat(match[0].replace(",", ""));
          break;
        }
      }
    }
  }
  
  if (!result.image) {
    result.image =
      document.querySelector('meta[property="og:image"]')?.content ||
      document.querySelector("#landingImage")?.src ||
      document.querySelector('[data-image-source-density-descriptor]')?.src ||
      document.querySelector("img[src*='product']")?.src;
  }
  
  return result.name && result.price ? result : null;
}

async function scrapeViaAPI(url) {
  try {
    const session = await getStoredSession();
    const response = await fetch(`${API_URL}/api/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || ""}`,
      },
      body: JSON.stringify({ url }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentProduct = {
        name: data.name,
        price: data.price,
        image: data.image_url,
        retailer: data.retailer,
        url: url,
      };
      displayProduct(currentProduct);
      await checkIfAlreadyTracking(url);
    } else {
      noProductEl.style.display = "block";
    }
  } catch (error) {
    console.error("API scrape error:", error);
    noProductEl.style.display = "block";
  }
}

function displayProduct(product) {
  productNameEl.textContent = product.name || "Unknown Product";
  productPriceEl.textContent = product.price 
    ? `$${product.price.toFixed(2)}` 
    : "Price not found";
  productRetailerEl.textContent = product.retailer || "Unknown store";
  
  if (product.image) {
    productImageEl.src = product.image;
    productImageEl.style.display = "block";
  } else {
    productImageEl.style.display = "none";
  }
  
  productCardEl.style.display = "block";
  noProductEl.style.display = "none";
  
  // Reset button state
  trackBtnEl.disabled = false;
  trackBtnEl.textContent = "Track This Product";
  successMessageEl.classList.remove("show");
  errorMessageEl.classList.remove("show");
  alreadyTrackingEl.classList.remove("show");
}

async function checkIfAlreadyTracking(url) {
  try {
    const session = await getStoredSession();
    const response = await fetch(`${API_URL}/api/extension/check-product?url=${encodeURIComponent(url)}`, {
      headers: {
        "Authorization": `Bearer ${session?.access_token || ""}`,
      },
    });
    
    const data = await response.json();
    
    if (data.isTracking) {
      alreadyTrackingEl.classList.add("show");
      trackBtnEl.textContent = "Track Again";
    }
  } catch (error) {
    console.error("Check tracking error:", error);
  }
}

// Track product
trackBtnEl.addEventListener("click", async () => {
  if (!currentProduct) return;
  
  trackBtnEl.disabled = true;
  trackBtnEl.textContent = "Adding...";
  errorMessageEl.classList.remove("show");
  
  try {
    const session = await getStoredSession();
    const targetPrice = targetPriceEl.value ? parseFloat(targetPriceEl.value) : null;
    
    const response = await fetch(`${API_URL}/api/extension/add-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || ""}`,
      },
      body: JSON.stringify({
        url: currentProduct.url,
        name: currentProduct.name,
        price: currentProduct.price,
        image_url: currentProduct.image,
        retailer: currentProduct.retailer,
        target_price: targetPrice,
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      showProductSuccess();
    } else {
      showProductError(data.error || "Failed to add product");
      trackBtnEl.disabled = false;
      trackBtnEl.textContent = "Track This Product";
    }
  } catch (error) {
    showProductError("Connection failed. Please try again.");
    trackBtnEl.disabled = false;
    trackBtnEl.textContent = "Track This Product";
  }
});

// Dashboard link
dashboardLinkEl.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: `${API_URL}/dashboard` });
});
