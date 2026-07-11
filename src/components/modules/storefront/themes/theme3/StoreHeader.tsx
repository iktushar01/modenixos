"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Phone, Search, ShoppingBag, X } from "lucide-react";
import { Category, Store } from "@/types/store.types";
import { StorefrontThemeConfig, resolveStoreLogo, resolveStorefrontNavLinks } from "@/lib/storefront";
import { buildShopHref } from "@/lib/shopFilters";
import { useCartHydrated } from "@/hooks/useCartHydrated";
import { useStoreCartCount } from "@/hooks/useStoreCart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, StorefrontSheetContent } from "../../StorefrontSheet";
import { StorefrontNavLink } from "../../StorefrontNavLink";
import { StorefrontAccountMenu } from "../../StorefrontAccountMenu";
import { useStorefrontTheme } from "../../StorefrontThemeContext";
import { useOptionalStorefrontNav } from "../../StorefrontNavContext";
import { useOptionalStorefrontCustomer } from "../../StorefrontCustomerContext";

interface StoreHeaderProps {
  store: Store;
  theme: StorefrontThemeConfig;
  categories: Category[];
}

export function StoreHeader({ store, theme, categories }: StoreHeaderProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { colorMode } = useStorefrontTheme();
  const storefrontNav = useOptionalStorefrontNav();
  const customerCtx = useOptionalStorefrontCustomer();
  const hydrated = useCartHydrated();
  const cartCount = useStoreCartCount(store.id);
  const logoUrl = resolveStoreLogo(store, theme, colorMode);
  const base = `/store/${store.slug}`;
  const isLoggedIn = Boolean(customerCtx?.customer);

  const navLinks = useMemo(
    () => resolveStorefrontNavLinks(theme, store.slug, categories).slice(0, 7),
    [theme, store.slug, categories],
  );

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const href = buildShopHref(store.slug, search.trim() ? { search: search.trim() } : undefined);
    storefrontNav ? storefrontNav.navigate(href) : router.push(href);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sf-safe-top sticky top-0 z-50 border-b sf-border bg-background/95 backdrop-blur">
        <div className="sf-section flex items-center gap-3 py-3">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <StorefrontNavLink href={base} className="group shrink-0 cursor-pointer">
            {logoUrl ? (
              <Image src={logoUrl} alt={store.brandName} width={160} height={48} className="h-8 w-auto max-w-[45vw] object-contain transition-opacity group-hover:opacity-80 sm:max-w-[160px]" unoptimized />
            ) : (
              <span className="text-lg font-semibold uppercase tracking-[0.08em] block max-w-[45vw] truncate transition-opacity group-hover:opacity-80 sm:max-w-xs">{store.brandName}</span>
            )}
          </StorefrontNavLink>

          <form onSubmit={onSearch} className="ml-auto hidden max-w-sm flex-1 lg:block">
            <div className="flex h-10 overflow-hidden rounded-full border sf-border bg-card">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products"
                className="h-full border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button type="submit" variant="ghost" size="icon" className="h-10 w-10 rounded-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {theme.contact.phone && (
            <a href={`tel:${theme.contact.phone}`} className="hidden h-10 w-10 items-center justify-center rounded-full border sf-border xl:inline-flex">
              <Phone className="h-4 w-4" />
            </a>
          )}

          <StorefrontNavLink href={`${base}/cart`} className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border sf-border">
            <ShoppingBag className="h-4 w-4" />
            {hydrated && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </StorefrontNavLink>

          <div className="hidden sm:block">
            <StorefrontAccountMenu base={base} className="inline-flex h-10 w-10 items-center justify-center rounded-full border sf-border" />
          </div>
        </div>

        <div className="hidden border-t sf-border lg:block">
          <nav className="sf-section flex gap-2 overflow-x-auto py-3">
            <StorefrontNavLink href={base} className="rounded-full border sf-border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]">Home</StorefrontNavLink>
            {navLinks.map((link) => (
              <StorefrontNavLink
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="rounded-full border sf-border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]"
              >
                {link.label}
              </StorefrontNavLink>
            ))}
          </nav>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <StorefrontSheetContent side="left" showCloseButton={false} className="w-full max-w-sm p-0">
          <div className="flex h-full flex-col p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-semibold tracking-[0.08em] uppercase">{store.brandName}</span>
              <Button type="button" size="icon" variant="ghost" onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={onSearch} className="mb-6 flex gap-2">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="flex-1" />
              <Button type="submit" size="icon"><Search className="h-4 w-4" /></Button>
            </form>

            <nav className="space-y-2">
              <StorefrontNavLink href={base} className="block rounded-lg border sf-border px-3 py-2 text-sm" onNavigate={() => setMobileOpen(false)}>Home</StorefrontNavLink>
              {navLinks.map((link) => (
                <StorefrontNavLink
                  key={`m-${link.label}-${link.href}`}
                  href={link.href}
                  className="block rounded-lg border sf-border px-3 py-2 text-sm"
                  onNavigate={() => setMobileOpen(false)}
                >
                  {link.label}
                </StorefrontNavLink>
              ))}
            </nav>

            <div className="mt-auto space-y-2 pt-6">
              {isLoggedIn ? (
                <button
                  type="button"
                  className="w-full rounded-lg border sf-border px-3 py-2 text-left text-sm"
                  onClick={async () => {
                    setMobileOpen(false);
                    await customerCtx?.logout();
                  }}
                >
                  Log out
                </button>
              ) : (
                <StorefrontNavLink href={`${base}/account/login`} className="block rounded-lg border sf-border px-3 py-2 text-sm" onNavigate={() => setMobileOpen(false)}>
                  Log in
                </StorefrontNavLink>
              )}
            </div>
          </div>
        </StorefrontSheetContent>
      </Sheet>
    </>
  );
}
