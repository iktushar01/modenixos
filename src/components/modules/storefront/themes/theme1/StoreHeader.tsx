"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Phone, Search, ShoppingBag, User, X } from "lucide-react";
import { Category, Store } from "@/types/store.types";
import { StorefrontThemeConfig, resolveStorefrontNavLinks } from "@/lib/storefront";
import { useCartHydrated } from "@/hooks/useCartHydrated";
import { useStoreCartCount } from "@/hooks/useStoreCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const base = `/store/${store.slug}`;
  const navLinks = useMemo(
    () => resolveStorefrontNavLinks(theme, store.slug, categories),
    [theme, store.slug, categories],
  );

  const menuItems = useMemo(
    () => [{ label: "HOME", href: base }, ...navLinks],
    [base, navLinks],
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
        <div className="sf-section border-b sf-border">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 md:grid-cols-3 md:gap-6 md:py-4">
            <div className="flex items-center gap-2 md:justify-self-start">
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

              {theme.header.showSearch && (
                <form onSubmit={handleSearch} className="hidden min-w-0 md:block">
                  <div className="sf-header-search">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products..."
                      className="sf-input h-10 border-0 px-3 text-sm shadow-none focus-visible:ring-0"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="sf-navbar-fg h-10 w-10 shrink-0 rounded-none"
                      aria-label="Search"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </div>

            <Link
              href={base}
              className="flex flex-col items-center justify-self-center text-center"
            >
              {store.logo ? (
                <Image
                  src={store.logo}
                  alt={store.brandName}
                  width={180}
                  height={56}
                  className="h-8 w-auto object-contain md:h-10"
                  unoptimized
                />
              ) : (
                <span className="sf-display-lg text-lg md:text-xl">{store.brandName}</span>
              )}
              {theme.header.tagline && (
                <span className="mt-1 hidden text-[10px] tracking-[0.22em] text-muted-foreground uppercase sm:block">
                  {theme.header.tagline}
                </span>
              )}
            </Link>

            <div className="flex items-center justify-end gap-1 md:gap-3 md:justify-self-end">
              {theme.header.showPhone && theme.contact.phone && (
                <a
                  href={`tel:${theme.contact.phone}`}
                  className="hidden p-2 sf-link lg:inline-flex"
                  aria-label="Call store"
                >
                  <Phone className="h-5 w-5" strokeWidth={1.5} />
                </a>
              )}

              <Link href={`${base}/cart`} className="relative p-2" aria-label="Cart">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {hydrated && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-semibold sf-primary">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href={`${base}/account/login`}
                className="hidden p-2 sf-link sm:inline-flex"
                aria-label="Account"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
              </Link>

              <div className="hidden sm:block">
                <StorefrontThemeToggle />
              </div>
            </div>
          </div>

          {theme.header.showSearch && (
            <form onSubmit={handleSearch} className="pb-3 md:hidden">
              <div className="sf-header-search">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="sf-input h-10 border-0 px-3 text-sm shadow-none focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="sf-navbar-fg h-10 w-10 shrink-0 rounded-none"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
        </div>

        {menuItems.length > 0 && (
          <nav className="sf-section hidden border-b sf-border md:block" aria-label="Store categories">
            <div className="sf-nav-menu sf-carousel-fade-left sf-carousel-fade-right">
              {menuItems.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="sf-nav-menu-item"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
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
              {menuItems.map((link) => (
                <Link
                  key={`m-${link.label}-${link.href}`}
                  href={link.href}
                  className="sf-eyebrow border-b sf-border py-4 text-sm transition-opacity hover:opacity-70"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {theme.header.showSearch && (
              <form onSubmit={handleSearch} className="mt-8 flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="sf-input flex-1"
                />
                <Button type="submit" size="icon" className="sf-btn-secondary shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            )}

            <div className="mt-auto space-y-4 border-t sf-border pt-6">
              <Link
                href={`${base}/account/login`}
                className="block text-sm sf-link"
                onClick={() => setMobileOpen(false)}
              >
                Account
              </Link>
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
