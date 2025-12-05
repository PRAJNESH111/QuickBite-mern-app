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
      console.log("📦 Using cached food data");
      return cached;
    }

    try {
      console.log("🌐 Fetching food data from API...");
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
      console.log("✅ Food data cached successfully");

      return data;
    } catch (error) {
      console.error("❌ Failed to fetch food data:", error);
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
      console.log("🌐 Fetching user orders from API...");
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
      console.log("✅ User orders fetched successfully");

      return data;
    } catch (error) {
      console.error("❌ Failed to fetch user orders:", error);
      throw error;
    }
  }

  /**
   * Clear all cache
   */
  clearCache() {
    cacheService.clearAll();
    console.log("🗑️ Cache cleared");
  }

  /**
   * Clear specific cache
   * @param {string} key - Cache key to clear
   */
  clearCacheKey(key) {
    cacheService.clear(key);
    console.log(`🗑️ Cache cleared for key: ${key}`);
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
