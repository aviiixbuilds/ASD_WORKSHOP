/**
 * In-Memory Cache Middleware
 *
 * Implements caching for GET /products and GET /products/:id using a JavaScript Map.
 * - Cache keys:
 *     GET /products     -> "products"
 *     GET /products/:id -> "product-{id}"
 * - TTL: 1 minute (60,000 milliseconds)
 * - Response Header:
 *     X-Cache: HIT  (served from in-memory cache)
 *     X-Cache: MISS (fetched fresh from database)
 */

// In-memory cache store using a standard JavaScript Map
const cacheStore = new Map();

// Time-To-Live (TTL): exactly 1 minute (60,000 ms)
const CACHE_TTL_MS = 60 * 1000;

/**
 * Build the unique cache key for a request.
 * - GET /products     -> "products"
 * - GET /products/:id -> "product-{id}"
 *
 * @param {import('express').Request} req
 * @returns {string} Unique cache key
 */
function getCacheKey(req) {
  if (req.params && req.params.id !== undefined) {
    return `product-${Number(req.params.id)}`;
  }
  return 'products';
}

/**
 * Express middleware that checks the in-memory Map for a valid cached response.
 * - If a non-expired entry exists, responds immediately with X-Cache: HIT.
 * - If the entry is expired, deletes it from the Map and proceeds as a MISS.
 * - On a MISS, sets X-Cache: MISS and caches the controller's 2xx response.
 */
function cacheMiddleware(req, res, next) {
  const key = getCacheKey(req);
  const cachedEntry = cacheStore.get(key);

  if (cachedEntry) {
    const now = Date.now();
    const age = now - cachedEntry.createdAt;

    // Check if the cached entry is still within the 60,000 ms TTL window
    if (age < CACHE_TTL_MS) {
      res.set('X-Cache', 'HIT');
      return res.status(200).json(cachedEntry.data);
    }

    // Entry has expired: remove it from the Map before fetching fresh data
    cacheStore.delete(key);
  }

  // Cache MISS: mark header and intercept res.json to store successful responses
  res.set('X-Cache', 'MISS');

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    // Only cache successful 2xx responses (do not cache 404 or error responses)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cacheStore.set(key, {
        data: body,
        createdAt: Date.now()
      });
    }
    return originalJson(body);
  };

  return next();
}

/**
 * Invalidate relevant cache entries after a successful POST, PUT, PATCH, or DELETE.
 * Always invalidates the list cache ("products"), and if a product ID is provided,
 * also invalidates that specific product's cache ("product-{id}").
 *
 * @param {number|string} [productId] - Optional product ID whose individual cache should be cleared
 */
function invalidateProductCache(productId) {
  // Always invalidate the product list cache so GET /products never returns stale data
  cacheStore.delete('products');

  // If a specific product was modified or deleted, invalidate its individual cache entry
  if (productId !== undefined && productId !== null) {
    cacheStore.delete(`product-${Number(productId)}`);
  }
}

/**
 * Clear all entries in the cache store (helper for testing).
 */
function clearAllCache() {
  cacheStore.clear();
}

module.exports = {
  cacheStore,
  CACHE_TTL_MS,
  getCacheKey,
  cacheMiddleware,
  invalidateProductCache,
  clearAllCache
};
