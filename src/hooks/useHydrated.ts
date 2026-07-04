"use client";

import { useEffect, useState } from "react";

/** True only after client mount — use before reading persisted Zustand state. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
