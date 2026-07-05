"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, StorefrontSheetContent } from "../../StorefrontSheet";
import { StorefrontThemeToggle } from "./StorefrontThemeToggle";
import { cn } from "@/lib/utils";

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
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const base = `/store/${store.slug}`;
  const navLinks = useMemo(
    () => resolveStorefrontNavLinks(theme, store.slug, categories),
    [theme, store.slug, categories],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <>
      <header
        className={cn(
          "sf-navbar sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "sf-glass-nav" : "sf-border border-b",
        )}
      >
        <div className="sf-section">
          <div className="flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
            <div className="flex flex-1 items-center gap-6">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="sf-navbar-fg shrink-0 md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <nav className="hidden items-center gap-5 lg:flex">
                {navLinks.slice(0, 4).map((link) => (
                  <Link
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    className="sf-eyebrow sf-link transition-colors sf-hover-fg"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <Link href={base} className="absolute left-1/2 flex -translate-x-1/2 items-center md:static md:translate-x-0">
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.brandName}
                  width={160}
                  height={52}
                  className="h-9 w-auto object-contain md:h-11"
                  unoptimized
                />
              ) : (
                <span className="sf-display-lg text-xl md:text-2xl">{store.brandName}</span>
              )}
            </Link>

            <div className="flex flex-1 items-center justify-end gap-3 md:gap-5">
              {theme.header.showSearch && (
                <form
                  onSubmit={handleSearch}
                  className="hidden items-center md:flex"
                >
                  <div className="flex items-center overflow-hidden rounded-full border sf-border">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search"
                      className="sf-input h-9 w-36 border-0 bg-transparent lg:w-44 xl:w-52"
                    />
                    <Select value={searchCategory || "all"} onValueChange={(v) => setSearchCategory(v === "all" ? "" : v)}>
                      <SelectTrigger className="sf-input h-9 w-[7.5rem] rounded-none border-0 border-l sf-border text-xs">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="submit" size="icon" className="sf-btn-secondary h-9 w-9 shrink-0 rounded-none">
                      <Search className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </form>
              )}

              {theme.header.showPhone && theme.contact.phone && (
                <a
                  href={`tel:${theme.contact.phone}`}
                  className="hidden items-center gap-2 sf-link lg:flex"
                >
                  <Phone className="h-4 w-4 sf-muted-fg" />
                  <span className="text-xs">{theme.contact.phone}</span>
                </a>
              )}

              <StorefrontThemeToggle />

              <Link href={`${base}/cart`} className="relative p-1.5">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {hydrated && cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-semibold sf-primary">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <StorefrontSheetContent side="left" showCloseButton={false} className="w-full max-w-md border-r p-0">
        <div className="flex h-full flex-col px-6 py-8">
          <div className="mb-10 flex items-center justify-between">
            <span className="sf-display-lg text-2xl">{store.brandName}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {theme.header.tagline && (
            <p className="sf-body-lg sf-muted-fg mb-8">{theme.header.tagline}</p>
          )}

          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={`m-${link.label}-${link.href}`}
                href={link.href}
                className="sf-display-lg border-b sf-border py-4 text-2xl transition-opacity hover:opacity-70"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {categories.length > 0 && (
            <div className="mt-8">
              <p className="sf-eyebrow mb-3">Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`${base}#shop?category=${encodeURIComponent(cat.slug)}`}
                    className="sf-filter-pill rounded-full px-4 py-1.5 text-xs"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {theme.header.showSearch && (
            <form onSubmit={handleSearch} className="mt-8 flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products"
                className="sf-input flex-1"
              />
              <Button type="submit" size="icon" className="sf-btn-secondary shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          )}

          <div className="mt-auto space-y-4 border-t sf-border pt-6">
            {theme.header.utilityLinks.map((link) => (
              <Link
                key={`mu-${link.label}-${link.href}`}
                href={resolveUtilityHref(base, link.href)}
                className="block text-sm sf-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <span className="sf-eyebrow">Theme</span>
              <StorefrontThemeToggle />
            </div>
          </div>
        </div>
        </StorefrontSheetContent>
      </Sheet>
    </>
  );
}
