import { useEffect, useState } from "react";

const DEFAULT_DEBOUNCE_DELAY = 300;

/**
 * Debounce value
 * @param {*} value - input value
 * @param {number} delay - delay ms
 * @returns {*} debounced value
 */
const useDebounce = (value, delay = DEFAULT_DEBOUNCE_DELAY) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;

