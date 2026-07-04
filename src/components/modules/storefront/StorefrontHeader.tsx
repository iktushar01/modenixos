"use client";

import { StoreNavbar } from "./StoreNavbar";
import { parseStorefrontTheme } from "@/lib/storefrontTheme";
import { Store } from "@/types/store.types";

/** @deprecated Use StoreNavbar directly */
export function StorefrontHeader({ store }: { store: Store }) {
  const theme = parseStorefrontTheme(store);
  return (
    <div className="bg-black">
      <StoreNavbar store={store} theme={theme} />
    </div>
  );
}
