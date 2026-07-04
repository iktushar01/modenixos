"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cart.store";

/** Waits for Zustand persist to rehydrate cart from localStorage. */
export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(() => useCartStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useCartStore.persist.onFinishHydration(() => setHydrated(true));
    if (!useCartStore.persist.hasHydrated()) {
      void useCartStore.persist.rehydrate();
    }
    return unsub;
  }, []);

  return hydrated;
}
