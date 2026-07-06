"use client";

import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import Image from "next/image";
import { useState } from "react";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { Category, Store } from "@/types/store.types";
import { StorefrontThemeConfig, resolveStorefrontNavLinks, resolveStoreLogo } from "@/lib/storefront";
import { useStorefrontTheme } from "@/components/modules/storefront/StorefrontThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  storeAboutPath,
  storeBasePath,
  storeContactUsPath,
  storePaymentRefundPolicyPath,
  storePrivacyPolicyPath,
  storeReturnExchangePolicyPath,
  storeShippingPolicyPath,
  storeTrackPath,
} from "@/lib/storePaths";

interface StoreFooterProps {
  store: Store;
  theme: StorefrontThemeConfig;
  categories?: Category[];
}

const POLICY_LINKS = [
  { label: "Privacy Policy", href: (slug: string) => storePrivacyPolicyPath(slug) },
  { label: "Shipping Policy", href: (slug: string) => storeShippingPolicyPath(slug) },
  { label: "Return & Exchange", href: (slug: string) => storeReturnExchangePolicyPath(slug) },
  { label: "Payment & Refund", href: (slug: string) => storePaymentRefundPolicyPath(slug) },
] as const;

export function StoreFooter({ store, theme, categories = [] }: StoreFooterProps) {
  const { colorMode } = useStorefrontTheme();
  const base = storeBasePath(store.slug);
  const [email, setEmail] = useState("");
  const navLinks = resolveStorefrontNavLinks(theme, store.slug, categories).slice(0, 5);
  const logoUrl = resolveStoreLogo(store, theme, colorMode);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="sf-border sf-footer border-t">
      <div className="sf-section w-full py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10 xl:gap-14">
          {/* Brand column */}
          <div className="lg:pr-4">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={store.brandName}
                width={160}
                height={52}
                className="h-9 w-auto object-contain md:h-10"
                unoptimized
              />
            ) : (
              <p className="sf-display-lg text-2xl md:text-3xl">{store.brandName}</p>
            )}
            {theme.header.tagline && (
              <p className="sf-muted-fg mt-3 max-w-xs text-sm leading-relaxed">{theme.header.tagline}</p>
            )}
            <div className="mt-6 flex gap-2">
              {theme.social.instagram && (
                <a
                  href={theme.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sf-link sf-social-btn sf-touch-target inline-flex h-9 w-9 items-center justify-center rounded-full border sf-border sf-hover-fg"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" strokeWidth={1.5} />
                </a>
              )}
              {theme.social.twitter && (
                <a
                  href={theme.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sf-link sf-social-btn sf-touch-target inline-flex h-9 w-9 items-center justify-center rounded-full border sf-border sf-hover-fg"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" strokeWidth={1.5} />
                </a>
              )}
              {theme.social.facebook && (
                <a
                  href={theme.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sf-link sf-social-btn sf-touch-target inline-flex h-9 w-9 items-center justify-center rounded-full border sf-border sf-hover-fg"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" strokeWidth={1.5} />
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="sf-eyebrow mb-5">Shop</p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <StorefrontNavLink href={link.href} className="sf-link sf-link-slide text-sm sf-hover-fg">
                    {link.label}
                  </StorefrontNavLink>
                </li>
              ))}
              <li>
                <StorefrontNavLink href={`${base}/cart`} className="sf-link sf-link-slide text-sm sf-hover-fg">
                  Cart
                </StorefrontNavLink>
              </li>
              <li>
                <StorefrontNavLink href={storeTrackPath(store.slug)} className="sf-link sf-link-slide text-sm sf-hover-fg">
                  Track order
                </StorefrontNavLink>
              </li>
            </ul>
          </div>

          {/* Company & policies */}
          <div>
            <p className="sf-eyebrow mb-5">Company</p>
            <ul className="space-y-2.5">
              <li>
                <StorefrontNavLink href={storeAboutPath(store.slug)} className="sf-link sf-link-slide text-sm sf-hover-fg">
                  About
                </StorefrontNavLink>
              </li>
              <li>
                <StorefrontNavLink href={storeContactUsPath(store.slug)} className="sf-link sf-link-slide text-sm sf-hover-fg">
                  Contact Us
                </StorefrontNavLink>
              </li>
              {theme.contact.phone && (
                <li>
                  <a href={`tel:${theme.contact.phone}`} className="sf-link sf-link-slide text-sm sf-hover-fg">
                    {theme.contact.phone}
                  </a>
                </li>
              )}
            </ul>

            <p className="sf-eyebrow mb-4 mt-8">Policies</p>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map((link) => (
                <li key={link.label}>
                  <StorefrontNavLink href={link.href(store.slug)} className="sf-link sf-link-slide text-sm sf-hover-fg">
                    {link.label}
                  </StorefrontNavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="sf-eyebrow mb-5">Newsletter</p>
            <p className="sf-muted-fg mb-4 text-sm leading-relaxed">
              Exclusive offers, new arrivals, and style notes — straight to your inbox.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="sf-input w-full"
                required
              />
              <Button type="submit" className="sf-btn-primary sf-btn-interactive w-full rounded-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="sf-border mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="sf-muted-fg text-center text-xs md:text-left">
              &copy; {new Date().getFullYear()} {store.brandName}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {POLICY_LINKS.map((link) => (
                <StorefrontNavLink
                  key={`bottom-${link.label}`}
                  href={link.href(store.slug)}
                  className="sf-muted-fg text-xs transition-colors sf-hover-fg"
                >
                  {link.label}
                </StorefrontNavLink>
              ))}
            </div>
            <p className="sf-eyebrow text-[10px]">Powered by ModenixOS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
