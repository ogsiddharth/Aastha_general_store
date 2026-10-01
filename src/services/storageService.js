/**
 * Storage Service
 * Handles localStorage read/write with robust try/catch blocks and JSON parsing error safeguards.
 */

export const storageService = {
  getItem: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`[storageService] Error reading key "${key}":`, error);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[storageService] Error writing key "${key}":`, error);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[storageService] Error removing key "${key}":`, error);
      return false;
    }
  },

  clear: () => {
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error(`[storageService] Error clearing storage:`, error);
      return false;
    }
  }
};
