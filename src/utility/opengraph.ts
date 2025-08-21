import axios from 'axios';
import { JSDOM } from 'jsdom';

interface OpenGraphData {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  price: string | null;
  currency: string | null;
  availability: string | null;
  brand: string | null;
}

/**
 * Fetches OpenGraph metadata from a given URL
 * @param url The URL to fetch metadata from
 * @returns Parsed OpenGraph data
 */
export async function fetchOpenGraphData(url: string): Promise<OpenGraphData> {
  try {
    // Validate URL
    const validatedUrl = validateUrl(url);
    
    // Fetch HTML content
    const response = await axios.get(validatedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000, // 10 seconds timeout
    });
    
    // Parse HTML
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Extract metadata with Twitter card fallback
    const result: OpenGraphData = {
      url: validatedUrl,
      title: extractMetaContentWithFallback(document, 'og:title', 'twitter:title') || document.title || null,
      description: extractMetaContentWithFallback(document, 'og:description', 'twitter:description') || extractMetaContent(document, 'description') || null,
      image: extractMetaContentWithFallback(document, 'og:image', 'twitter:image') || null,
      siteName: extractMetaContentWithFallback(document, 'og:site_name', 'twitter:site') || null,
      price: extractMetaContent(document, 'og:price:amount') || extractMetaContent(document, 'product:price:amount') || null,
      currency: extractMetaContent(document, 'og:price:currency') || extractMetaContent(document, 'product:price:currency') || null,
      availability: extractMetaContent(document, 'og:availability') || extractMetaContent(document, 'product:availability') || null,
      brand: extractMetaContent(document, 'og:brand') || extractMetaContent(document, 'product:brand') || null,
    };
    
    return result;
  } catch (error) {
    console.error('Error fetching OpenGraph data:', error);
    throw new Error('Failed to fetch metadata from URL');
  }
}

/**
 * Extracts meta content from HTML document with Twitter card fallback
 * @param document DOM document
 * @param ogProperty OpenGraph property to extract
 * @param twitterProperty Twitter card property to use as fallback
 * @returns Content of the meta tag or null
 */
function extractMetaContentWithFallback(document: Document, ogProperty: string, twitterProperty: string): string | null {
  // First try OpenGraph data
  const ogContent = extractMetaContent(document, ogProperty);
  if (ogContent && ogContent.trim() !== '') {
    return ogContent;
  }
  
  // Fallback to Twitter card data
  const twitterContent = extractMetaContent(document, twitterProperty);
  if (twitterContent && twitterContent.trim() !== '') {
    return twitterContent;
  }
  
  return null;
}

/**
 * Extracts meta content from HTML document
 * @param document DOM document
 * @param property Meta property to extract
 * @returns Content of the meta tag or null
 */
function extractMetaContent(document: Document, property: string): string | null {
  // Try og: meta tags
  const ogMeta = document.querySelector(`meta[property="${property}"]`);
  if (ogMeta && ogMeta.getAttribute('content')) {
    return ogMeta.getAttribute('content');
  }
  
  // Try name meta tags (for description etc.)
  const nameMeta = document.querySelector(`meta[name="${property}"]`);
  if (nameMeta && nameMeta.getAttribute('content')) {
    return nameMeta.getAttribute('content');
  }
  
  return null;
}

/**
 * Validates and formats a URL
 * @param url URL to validate
 * @returns Validated URL
 */
function validateUrl(url: string): string {
  try {
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Test if valid URL
    new URL(url);
    
    return url;
  } catch {
    throw new Error('Invalid URL');
  }
} 