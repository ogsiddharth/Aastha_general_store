import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

/**
 * Custom hook to manage persistent state in localStorage with error handling.
 * @param {string} key 
 * @param {any} initialValue 
 * @returns {[any, Function]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return storageService.getItem(key, initialValue);
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageService.setItem(key, valueToStore);
    } catch (error) {
      console.error(`[useLocalStorage] Error updating key "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          setStoredValue(e.newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
