/**
 * useDebounce Hook
 * Delays updating a value until after a specified delay
 * Useful for search inputs to prevent excessive API calls
 */

import { useState, useEffect } from 'react';

/**
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {any} - Debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
