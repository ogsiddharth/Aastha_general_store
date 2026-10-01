import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any value (e.g. search input).
 * @param {any} value 
 * @param {number} delay In milliseconds (default 300ms)
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
