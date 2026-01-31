// PriceGhost Content Script - Runs on product pages

(function() {
  // Check if already initialized
  if (window.__priceGhostInitialized) return;
  window.__priceGhostInitialized = true;

  // Create floating button
  function createFloatingButton() {
    // Check if button already exists
    if (document.getElementById("priceghost-fab")) return;

    const fab = document.createElement("div");
    fab.id = "priceghost-fab";
    fab.innerHTML = `
      <div class="priceghost-fab-icon">👻</div>
      <div class="priceghost-fab-text">Track Price</div>
    `;
    
    fab.addEventListener("click", () => {
      // Send message to open popup or directly track
      chrome.runtime.sendMessage({ action: "openPopup" });
    });

    document.body.appendChild(fab);

    // Show tooltip on hover
    fab.addEventListener("mouseenter", () => {
      fab.classList.add("expanded");
    });
    
    fab.addEventListener("mouseleave", () => {
      fab.classList.remove("expanded");
    });
  }

  // Detect if current page is a product page
  function isProductPage() {
    const url = window.location.href.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();
    
    // Amazon
    if (hostname.includes("amazon")) {
      return url.includes("/dp/") || url.includes("/gp/product/");
    }
    
    // Walmart
    if (hostname.includes("walmart")) {
      return url.includes("/ip/");
    }
    
    // Best Buy
    if (hostname.includes("bestbuy")) {
      return url.includes("/site/") && url.includes(".p");
    }
    
    // Target
    if (hostname.includes("target")) {
      return url.includes("/-/A-");
    }
    
    // eBay
    if (hostname.includes("ebay")) {
      return url.includes("/itm/");
    }
    
    // Generic product detection
    const hasProductSchema = !!document.querySelector('script[type="application/ld+json"]');
    const hasProductPrice = !!document.querySelector('[class*="price"], [data-price]');
    const hasAddToCart = !!document.querySelector('[class*="add-to-cart"], [class*="addToCart"], button[name*="cart"]');
    
    return hasProductSchema && hasProductPrice;
  }

  // Initialize
  function init() {
    if (isProductPage()) {
      createFloatingButton();
    }
  }

  // Run on load
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }

  // Listen for URL changes (SPA support)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(init, 1000); // Wait for page to load
    }
  }).observe(document, { subtree: true, childList: true });
})();
