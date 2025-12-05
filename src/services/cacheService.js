/**
 * Cache Service - Handles API response caching with expiration
 * Reduces unnecessary API calls and improves app performance
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.CACHE_DURATION = 30 * 60 * 1000; // 30 minutes default
  }

  /**
   * Get item from cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached data or null if expired/not found
   */
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const timestamp = this.timestamps.get(key);
    const now = Date.now();

    // Check if cache has expired
    if (now - timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  /**
   * Set item in cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} duration - Custom duration in ms (optional)
   */
  set(key, data, duration = this.CACHE_DURATION) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
  }

  /**
   * Clear specific cache entry
   * @param {string} key - Cache key to clear
   */
  clear(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.cache.clear();
    this.timestamps.clear();
  }

  /**
   * Check if key exists and is valid
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Get cache info (for debugging)
   */
  getInfo() {
    const entries = [];
    for (const [key, value] of this.cache.entries()) {
      const timestamp = this.timestamps.get(key);
      const age = Date.now() - timestamp;
      const isExpired = age > this.CACHE_DURATION;
      entries.push({
        key,
        age: Math.round(age / 1000), // in seconds
        size: JSON.stringify(value).length,
        isExpired,
      });
    }
    return {
      totalEntries: entries.length,
      entries,
    };
  }
}

// Export singleton instance
export default new CacheService();
