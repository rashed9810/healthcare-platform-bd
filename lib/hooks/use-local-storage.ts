"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize the state
  useEffect(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      // If no item, return initialValue
      if (!item) {
        setStoredValue(initialValue);
        return;
      }

      // Try to parse as JSON, but handle simple string values
      let value;
      try {
        // Try to parse as JSON
        value = JSON.parse(item);
      } catch (parseError) {
        // If it's not valid JSON, use the raw string
        // This handles cases where simple strings like "en" are stored
        value = item;

        // If the initialValue is of a different type than the stored string,
        // we should convert the string to match the expected type
        if (typeof initialValue !== "string") {
          // For boolean values
          if (typeof initialValue === "boolean") {
            value = item === "true";
          }
          // For number values
          else if (typeof initialValue === "number") {
            value = Number(item);
          }
        }
      }

      setStoredValue(value);
    } catch (error) {
      // If error also return initialValue
      console.error("Error reading from localStorage:", error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        // Ensure we're storing valid JSON
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (stringifyError) {
          // If JSON.stringify fails, store as string if possible
          if (
            typeof valueToStore === "string" ||
            typeof valueToStore === "number" ||
            typeof valueToStore === "boolean"
          ) {
            window.localStorage.setItem(key, String(valueToStore));
          } else {
            throw stringifyError; // Re-throw if we can't handle it
          }
        }
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}
