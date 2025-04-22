// content_scripts/scraper.js

import { SITE_SELECTORS } from '../selectors/site-selectors.js';

// Determine current site host (e.g. "example-retailer.com")
const host = window.location.host.replace(/^www\./, '');
const selectors = SITE_SELECTORS[host];

if (!selectors) {
  // No scraping rules defined for this site
  console.debug(`BAXUS Finder: no selectors configured for ${host}`);
} else {
  // Extract bottle information
  const nameEl = document.querySelector(selectors.name);
  const priceEl = document.querySelector(selectors.price);
  const imageEl = document.querySelector(selectors.image);
  const vintageEl = selectors.vintage ? document.querySelector(selectors.vintage) : null;

  const bottleName = nameEl?.textContent.trim() || '';
  const priceText = priceEl?.textContent.trim() || '';
  const price = parseFloat(priceText.replace(/[^0-9\.]/g, '')) || 0;
  const imageUrl = imageEl?.src || '';
  const vintage = vintageEl?.textContent.trim() || '';

  const scrapedData = {
    bottleName,
    vintage,
    price,
    imageUrl,
    
    sourceUrl: window.location.href
  };

  // Send scraped data to background for matching
  chrome.runtime.sendMessage({
    action: 'SCRAPED_BOTTLE',
    data: scrapedData
  });
}
