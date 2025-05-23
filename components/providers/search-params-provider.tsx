"use client";

import React, { ReactNode, createContext, useContext } from "react";
import { useSearchParams as useNextSearchParams } from "next/navigation";

// Create a context to hold the search params
const SearchParamsContext = createContext<URLSearchParams | null>(null);

// Hook to use search params safely
export function useSearchParams() {
  const context = useContext(SearchParamsContext);
  if (!context) {
    throw new Error("useSearchParams must be used within a SearchParamsProvider");
  }
  return context;
}

// Provider component that wraps useSearchParams in a Suspense boundary
export function SearchParamsProvider({ children }: { children: ReactNode }) {
  // This will be wrapped in a Suspense boundary by the consumer
  const searchParams = useNextSearchParams();
  
  return (
    <SearchParamsContext.Provider value={searchParams}>
      {children}
    </SearchParamsContext.Provider>
  );
}

// Component that wraps children in a SearchParamsProvider with Suspense
export function WithSearchParams({ children }: { children: ReactNode }) {
  return (
    <React.Suspense fallback={null}>
      <SearchParamsProvider>
        {children}
      </SearchParamsProvider>
    </React.Suspense>
  );
}
