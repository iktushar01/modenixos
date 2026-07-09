"use client";

import Image from "next/image";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { Category, Store } from "@/types/store.types";
import { StorefrontThemeConfig, resolveStorefrontNavLinks, resolveStoreLogo } from "@/lib/storefront";
import { useStorefrontTheme } from "@/components/modules/storefront/StorefrontThemeContext";
import { StorefrontNavLink } from "../../../StorefrontNavLink";
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

interface FooterProps {
  store: Store;
  theme: StorefrontThemeConfig;
  categories?: Category[];
}

const POLICY_LINKS = [
  { label: "Privacy", href: (slug: string) => storePrivacyPolicyPath(slug) },
  { label: "Shipping", href: (slug: string) => storeShippingPolicyPath(slug) },
  { label: "Returns", href: (slug: string) => storeReturnExchangePolicyPath(slug) },
  { label: "Refunds", href: (slug: string) => storePaymentRefundPolicyPath(slug) },
] as const;

export function Footer({ store, theme, categories = [] }: FooterProps) {
  const { colorMode } = useStorefrontTheme();
  const base = storeBasePath(store.slug);
  const navLinks = resolveStorefrontNavLinks(theme, store.slug, categories).slice(0, 4);
  const logoUrl = resolveStoreLogo(store, theme, colorMode);

  return (
    <footer className="sf-t2-footer border-t sf-border">
      <div className="sf-section py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={store.brandName}
                width={140}
                height={44}
                className="h-8 w-auto object-contain"
                unoptimized
              />
            ) : (
              <p className="sf-t2-footer-brand">{store.brandName}</p>
            )}
            {theme.header.tagline && (
              <p className="sf-t2-section-sub mt-3 max-w-sm">{theme.header.tagline}</p>
            )}
            <div className="mt-5 flex gap-3">
              {theme.social.instagram && (
                <a href={theme.social.instagram} target="_blank" rel="noopener noreferrer" className="sf-t2-social" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {theme.social.twitter && (
                <a href={theme.social.twitter} target="_blank" rel="noopener noreferrer" className="sf-t2-social" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {theme.social.facebook && (
                <a href={theme.social.facebook} target="_blank" rel="noopener noreferrer" className="sf-t2-social" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="sf-t2-label mb-4">Navigate</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <StorefrontNavLink href={link.href} className="sf-t2-footer-link">
                    {link.label}
                  </StorefrontNavLink>
                </li>
              ))}
              <li>
                <StorefrontNavLink href={`${base}/cart`} className="sf-t2-footer-link">Cart</StorefrontNavLink>
              </li>
              <li>
                <StorefrontNavLink href={storeTrackPath(store.slug)} className="sf-t2-footer-link">Track order</StorefrontNavLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="sf-t2-label mb-4">Info</p>
            <ul className="space-y-2">
              <li>
                <StorefrontNavLink href={storeAboutPath(store.slug)} className="sf-t2-footer-link">About</StorefrontNavLink>
              </li>
              <li>
                <StorefrontNavLink href={storeContactUsPath(store.slug)} className="sf-t2-footer-link">Contact</StorefrontNavLink>
              </li>
              {theme.contact.phone && (
                <li>
                  <a href={`tel:${theme.contact.phone}`} className="sf-t2-footer-link">
                    {theme.contact.phone}
                  </a>
                </li>
              )}
              {POLICY_LINKS.map((link) => (
                <li key={link.label}>
                  <StorefrontNavLink href={link.href(store.slug)} className="sf-t2-footer-link">
                    {link.label}
                  </StorefrontNavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sf-t2-footer-bar mt-12 flex flex-col items-center justify-between gap-3 border-t sf-border pt-6 text-center md:flex-row md:text-left">
          <p className="sf-t2-section-sub text-xs">
            &copy; {new Date().getFullYear()} {store.brandName}
          </p>
          <p className="sf-t2-label text-[10px]">Powered by ModenixOS</p>
        </div>
      </div>
    </footer>
  );
}
