"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Phone, Search, ShoppingBag, X } from "lucide-react";
import { Category, Store } from "@/types/store.types";
import { StorefrontThemeConfig, resolveStorefrontNavLinks } from "@/lib/storefront";
import { useCartHydrated } from "@/hooks/useCartHydrated";
import { useStoreCartCount } from "@/hooks/useStoreCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StoreHeaderProps {
  store: Store;
  theme: StorefrontThemeConfig;
  categories: Category[];
}

function resolveUtilityHref(base: string, href: string) {
  if (href.startsWith("#")) return `${base}${href}`;
  if (href.startsWith("/store/")) return href;
  if (href === "/cart" || href.endsWith("/cart")) return `${base}/cart`;
  return href;
}

export function StoreHeader({ store, theme, categories }: StoreHeaderProps) {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const cartCount = useStoreCartCount(store.id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const base = `/store/${store.slug}`;
  const navLinks = useMemo(
    () => resolveStorefrontNavLinks(theme, store.slug, categories),
    [theme, store.slug, categories],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (searchCategory) params.set("category", searchCategory);
    const qs = params.toString();
    router.push(`${base}#shop${qs ? `?${qs}` : ""}`);
    setMobileOpen(false);
  };

  return (
    <header className="sf-navbar sf-border sticky top-0 z-50 w-full border-b">
      <div className="sf-border hidden border-b md:block">
        <div className="sf-section flex h-9 items-center justify-between text-xs">
          {theme.header.tagline ? (
            <span className="sf-muted-fg">{theme.header.tagline}</span>
          ) : (
            <span />
          )}
          <nav className="flex items-center gap-4">
            {theme.header.utilityLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={resolveUtilityHref(base, link.href)}
                className="sf-link transition-colors sf-hover-fg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="sf-section">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Link href={base} className="flex shrink-0 items-center">
            {store.logo ? (
              <Image
                src={store.logo}
                alt={store.brandName}
                width={140}
                height={48}
                className="h-10 w-auto object-contain md:h-12"
                unoptimized
              />
            ) : (
              <span className="text-xl font-semibold tracking-wide md:text-2xl">{store.brandName}</span>
            )}
          </Link>

          {theme.header.showSearch && (
            <form
              onSubmit={handleSearch}
              className="hidden flex-1 items-center gap-0 md:flex md:max-w-2xl lg:max-w-3xl"
            >
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="sf-input h-11 rounded-r-none border-r-0"
              />
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="sf-input h-11 border px-3 text-sm"
                aria-label="Filter by category"
              >
                <option value="">Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Button type="submit" className="sf-primary h-11 rounded-l-none px-4">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          )}

          <div className="flex items-center gap-3 md:gap-5">
            {theme.header.showPhone && theme.contact.phone && (
              <div className="hidden items-center gap-2 lg:flex">
                <Phone className="h-4 w-4 sf-muted-fg" />
                <div className="text-xs">
                  <p className="sf-muted-fg">Call Us Now</p>
                  <a href={`tel:${theme.contact.phone}`} className="font-medium sf-hover-fg">
                    {theme.contact.phone}
                  </a>
                </div>
              </div>
            )}

            <Link href={`${base}/cart`} className="relative p-1">
              <ShoppingBag className="h-5 w-5" />
              {hydrated && cartCount > 0 && (
                <span className="sf-badge-secondary absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {navLinks.length > 0 && (
        <div className="sf-border hidden border-t md:block">
          <nav className="sf-section flex h-11 items-center justify-center gap-6 overflow-x-auto text-xs font-medium tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="whitespace-nowrap sf-link transition-colors sf-hover-fg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {mobileOpen && (
        <div className="sf-border border-t md:hidden">
          <div className="sf-section space-y-4 py-4">
            {theme.header.showSearch && (
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="sf-input flex-1"
                />
                <Button type="submit" size="icon" className="sf-primary shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            )}
            {theme.header.tagline && <p className="text-xs sf-muted-fg">{theme.header.tagline}</p>}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={`m-${link.label}-${link.href}`}
                  href={link.href}
                  className="py-1 text-sm sf-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <nav className="sf-border flex flex-col gap-2 border-t pt-3">
              {theme.header.utilityLinks.map((link) => (
                <Link
                  key={`mu-${link.label}-${link.href}`}
                  href={resolveUtilityHref(base, link.href)}
                  className="py-1 text-sm sf-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {theme.header.showPhone && theme.contact.phone && (
              <a href={`tel:${theme.contact.phone}`} className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                {theme.contact.phone}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
