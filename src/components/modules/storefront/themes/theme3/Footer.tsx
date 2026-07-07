"use client";

import { Category, Store } from "@/types/store.types";
import { StorefrontThemeConfig, resolveStorefrontNavLinks } from "@/lib/storefront";
import { StorefrontNavLink } from "../../StorefrontNavLink";
import {
  storeAboutPath,
  storeContactUsPath,
  storePaymentRefundPolicyPath,
  storePrivacyPolicyPath,
  storeReturnExchangePolicyPath,
  storeShippingPolicyPath,
} from "@/lib/storePaths";

interface FooterProps {
  store: Store;
  theme: StorefrontThemeConfig;
  categories?: Category[];
}

export function Footer({ store, theme, categories = [] }: FooterProps) {
  const navLinks = resolveStorefrontNavLinks(theme, store.slug, categories).slice(0, 5);
  const policyLinks = [
    { label: "Privacy", href: storePrivacyPolicyPath(store.slug) },
    { label: "Shipping", href: storeShippingPolicyPath(store.slug) },
    { label: "Returns", href: storeReturnExchangePolicyPath(store.slug) },
    { label: "Refunds", href: storePaymentRefundPolicyPath(store.slug) },
  ];

  return (
    <footer className="mt-16 border-t sf-border bg-card">
      <div className="sf-section py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Brand</p>
            <h3 className="mt-3 text-2xl font-semibold">{store.brandName}</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              {theme.header.tagline || "A curated storefront experience powered by ModenixOS."}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Browse</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {navLinks.map((link) => (
                <StorefrontNavLink key={link.href} href={link.href} className="rounded-full border sf-border px-3 py-1.5 text-xs">
                  {link.label}
                </StorefrontNavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Support</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><StorefrontNavLink href={storeAboutPath(store.slug)} className="hover:underline">About</StorefrontNavLink></li>
              <li><StorefrontNavLink href={storeContactUsPath(store.slug)} className="hover:underline">Contact</StorefrontNavLink></li>
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <StorefrontNavLink href={link.href} className="hover:underline">{link.label}</StorefrontNavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t sf-border pt-5 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {store.brandName}. Built with ModenixOS.
        </div>
      </div>
    </footer>
  );
}
