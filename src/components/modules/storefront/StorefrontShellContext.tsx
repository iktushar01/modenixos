"use client";

import { createContext, useContext } from "react";

const StorefrontShellContext = createContext(false);

export function StorefrontShellProvider({
  value,
  children,
}: {
  value: boolean;
  children: React.ReactNode;
}) {
  return <StorefrontShellContext.Provider value={value}>{children}</StorefrontShellContext.Provider>;
}

/** True when header/footer are already rendered by StorefrontInnerLayout. */
export function useStorefrontShellProvided() {
  return useContext(StorefrontShellContext);
}
