// PriceGhost Background Service Worker

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openPopup") {
    // Can't programmatically open popup, so we'll show a notification
    // suggesting to click the extension icon
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setBadgeBackgroundColor({ color: "#10b981" });
    
    // Clear badge after 3 seconds
    setTimeout(() => {
      chrome.action.setBadgeText({ text: "" });
    }, 3000);
  }
});

// Track when extension is installed
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Open welcome page on install
    chrome.tabs.create({
      url: "http://localhost:3000/signup?ref=extension"
    });
  }
});

// Listen for tab updates to show badge on product pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = tab.url.toLowerCase();
    
    // Check if it's a product page
    const isProduct = 
      (url.includes("amazon") && (url.includes("/dp/") || url.includes("/gp/product/"))) ||
      (url.includes("walmart") && url.includes("/ip/")) ||
      (url.includes("bestbuy") && url.includes("/site/")) ||
      (url.includes("target") && url.includes("/-/A-")) ||
      (url.includes("ebay") && url.includes("/itm/"));
    
    if (isProduct) {
      chrome.action.setBadgeText({ text: "+", tabId });
      chrome.action.setBadgeBackgroundColor({ color: "#10b981", tabId });
    } else {
      chrome.action.setBadgeText({ text: "", tabId });
    }
  }
});
