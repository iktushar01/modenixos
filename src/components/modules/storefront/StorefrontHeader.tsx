import Link from "next/link";
import { Store } from "@/types/store.types";

export function StorefrontHeader({ store }: { store: Store }) {
  const theme = (store.theme ?? {}) as Record<string, string>;
  return (
    <header
      className="border-b"
      style={{ backgroundColor: theme.primaryColor ?? undefined, color: "#fff" }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href={`/store/${store.slug}`} className="text-xl font-bold">
          {store.logo ? <img src={store.logo} alt={store.brandName} className="h-8" /> : store.brandName}
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href={`/store/${store.slug}`}>Shop</Link>
          <Link href={`/store/${store.slug}/cart`}>Cart</Link>
        </nav>
      </div>
    </header>
  );
}
