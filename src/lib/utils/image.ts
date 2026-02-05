/**
 * Validates and sanitizes image URLs for use with next/image
 * Handles protocol-relative URLs and invalid URLs
 */
export function getValidImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // Handle protocol-relative URLs (starting with //)
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // Check if it's a valid http/https URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Filter out tracking/analytics URLs that aren't actual images
    const invalidPatterns = [
      '/batch/',
      '/uedata',
      'fls-eu.amazon',
      'fls-na.amazon',
      '/gp/r.html',
      'amazon-adsystem.com',
    ];
    
    if (invalidPatterns.some(pattern => url.includes(pattern))) {
      return null;
    }
    
    return url;
  }
  
  // Relative URLs starting with / are likely internal
  if (url.startsWith('/')) {
    return url;
  }
  
  // Data URLs are valid
  if (url.startsWith('data:')) {
    return url;
  }
  
  // Invalid URL format
  return null;
}
