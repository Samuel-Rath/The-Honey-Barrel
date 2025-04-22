const BAXUS_BASE = 'https://services.baxus.co/api/search/listings';

/**
 * Search BAXUS listings by name (and optional vintage).
 *
 * @param {string} name    Bottle name to query
 * @param {string} vintage (Optional) vintage/year string
 * @param {number} from    Result offset (for pagination)
 * @param {number} size    Number of results to fetch
 * @returns {Promise<Array>} Array of listing objects from BAXUS
 */
export async function searchListings(name, vintage = '', from = 0, size = 20) {
  // Build query string; vintage appended to boost relevance
  const q = encodeURIComponent(vintage
    ? `${name} ${vintage}`
    : name
  );
  const url = `${BAXUS_BASE}?from=${from}&size=${size}&listed=true&q=${q}`;

  const resp = await fetch(url, {
    // If you have an API key, insert it here. Otherwise BAXUS may allow public search.
    headers: {
      // 'Authorization': `Bearer ${YOUR_API_KEY}`
    }
  });

  if (!resp.ok) {
    throw new Error(`BAXUS API error: ${resp.status} ${resp.statusText}`);
  }

  const body = await resp.json();
  // Adjust depending on the actual response shape:
  // assume `{ hits: [ { id, name, vintage, price, ... }, ... ] }`
  return Array.isArray(body.hits) ? body.hits : [];
}
