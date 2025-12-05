/**
 * API Service - Handles API calls with automatic caching
 * Reduces unnecessary API requests
 */

import { API_URL } from "../config";
import cacheService from "./cacheService";

class APIService {
  /**
   * Fetch food data with caching
   * @returns {Promise<Array>} - [foodItems, foodCategories]
   */
  async fetchFoodData() {
    const cacheKey = "foodData";

    // Check cache first
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${API_URL}/api/foodData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Cache the response for 30 minutes
      cacheService.set(cacheKey, data);

      return data;
    } catch (error) {
      console.error("Failed to fetch food data:", error);
      throw error;
    }
  }

  /**
   * Fetch user orders without caching (always fresh)
   * @param {string} token - Auth token
   * @returns {Promise<Object>} - Order data
   */
  async fetchUserOrders(token) {
    try {
      const response = await fetch(`${API_URL}/api/myOrderData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      throw error;
    }
  }

  /**
   * Clear all cache
   */
  clearCache() {
    cacheService.clearAll();
  }

  /**
   * Clear specific cache
   * @param {string} key - Cache key to clear
   */
  clearCacheKey(key) {
    cacheService.clear(key);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return cacheService.getInfo();
  }
}

// Export singleton instance
export default new APIService();
