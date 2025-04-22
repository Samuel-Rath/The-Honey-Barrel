import { searchListings } from '../utils/api.js';
import { matchListings }   from '../utils/matcher.js';

/**
 * Listen for scraped bottle data from content scripts,
 * fetch BAXUS listings, run matching, and broadcast results.
 */
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'SCRAPED_BOTTLE') {
    const bottle = message.data;
    console.debug('BAXUS Finder: received scraped bottle data', bottle);

    // Fetch & match
    searchListings(bottle.bottleName, bottle.vintage)
      .then(listings => matchListings(bottle, listings))
      .then(matches => {
        chrome.runtime.sendMessage({
          action:  'SHOW_RESULTS',
          payload: { matches, sourceUrl: bottle.sourceUrl }
        });
      })
      .catch(err => {
        console.error('BAXUS Finder: error fetching/matching', err);
        // Optionally notify the popup of the error:
        chrome.runtime.sendMessage({
          action:  'SHOW_ERROR',
          payload: { message: err.message }
        });
      });
  }
  // Return true if we ever want to sendResponse asynchronously
  return true;
});
