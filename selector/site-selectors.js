/**
 * Map of retailer hostnames to CSS selectors for scraping bottle data.
 * To support a new site, add its hostname and the corresponding selectors below.
 */
// selectors/site‑selectors.js
export const SITE_SELECTORS = {
    'www.danmurphys.com.au': {
      name:  '#pdp-productname > div',
      price: '#mat-tab-content-1-0 .pack__right',
      image: 'img.zoom__image'   
    }
  };
  
  
  