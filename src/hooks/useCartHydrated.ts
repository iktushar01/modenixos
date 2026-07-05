"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cart.store";

/** Waits for Zustand persist to rehydrate cart from localStorage. */
export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useCartStore.persist;
    if (!persist) {
      setHydrated(true);
      return;
    }

    setHydrated(persist.hasHydrated());

    const unsub = persist.onFinishHydration(() => setHydrated(true));
    if (!persist.hasHydrated()) {
      void persist.rehydrate();
    }
    return unsub;
  }, []);

  return hydrated;
}
