import Fuse from 'fuse.js';

/**
 * Match scraped bottle data against an array of BAXUS listings.
 *
 * @param {Object} scraped
 * @param {string} scraped.bottleName
 * @param {string} scraped.vintage
 * @param {Array}  listings   Output of searchListings()
 * @returns {Array} Array of matches sorted by best score + best price
 */
export function matchListings(scraped, listings) {
  // Prepare Fuse.js index
  const fuse = new Fuse(listings, {
    keys: [
      { name: 'name',      weight: 0.7 },
      { name: 'vintage',   weight: 0.3 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 3
  });

  // Search by bottle name + vintage
  const query = scraped.vintage
    ? `${scraped.bottleName} ${scraped.vintage}`
    : scraped.bottleName;

  const results = fuse.search(query);

  // Map to a simpler match object, include score and compute savings
  return results.map(r => {
    const listing = r.item;
    const sourcePrice = scraped.price;
    const matchPrice  = listing.price;
    const savingsPct  = sourcePrice
      ? ((sourcePrice - matchPrice) / sourcePrice) * 100
      : 0;

    return {
      id:         listing.id,
      name:       listing.name,
      vintage:    listing.vintage,
      imageUrl:   listing.imageUrl || scraped.imageUrl,
      score:      r.score,
      sourcePrice,
      matchPrice,
      savingsPct: savingsPct.toFixed(1)
    };
  })
  // Sort: best (lowest) Fuse score first, then greatest savings
  .sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    return b.savingsPct - a.savingsPct;
  });
}
