import { useState, useEffect } from "react";

/**
 * useDebounce
 * @param value - the value you want to debounce
 * @param delay - delay in ms (default 1sec)
 * @returns debouncedValue
 */
export function useDebounce(value: string, delay: number = 1000) {
    const [debouncedValue, setDebouncedValue] = useState<string>(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}
