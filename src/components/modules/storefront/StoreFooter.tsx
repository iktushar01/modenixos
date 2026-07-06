"use client";

import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import Image from "next/image";
import { useState } from "react";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { Category, Store } from "@/types/store.types";
import { StorefrontThemeConfig, resolveStorefrontNavLinks } from "@/lib/storefront";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StoreFooterProps {
  store: Store;
  theme: StorefrontThemeConfig;
  categories?: Category[];
}

export function StoreFooter({ store, theme, categories = [] }: StoreFooterProps) {
  const base = `/store/${store.slug}`;
  const [email, setEmail] = useState("");
  const navLinks = resolveStorefrontNavLinks(theme, store.slug, categories).slice(0, 6);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="sf-border sf-footer border-t">
      <div className="sf-section w-full py-16 md:py-20">
        <div className="mb-14 text-center md:mb-16">
          {store.logo ? (
            <Image
              src={store.logo}
              alt={store.brandName}
              width={180}
              height={60}
              className="mx-auto h-10 w-auto object-contain md:h-12"
              unoptimized
            />
          ) : (
            <p className="sf-display-lg text-3xl sm:text-4xl md:text-5xl">{store.brandName}</p>
          )}
          {theme.header.tagline && (
            <p className="sf-body-lg sf-muted-fg mx-auto mt-3 max-w-md">{theme.header.tagline}</p>
          )}
        </div>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:gap-16">
          <div>
            <p className="sf-eyebrow mb-4">Shop</p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <StorefrontNavLink href={link.href} className="sf-link text-sm transition-colors sf-hover-fg">
                    {link.label}
                  </StorefrontNavLink>
                </li>
              ))}
              <li>
                <StorefrontNavLink href={`${base}/cart`} className="sf-link text-sm transition-colors sf-hover-fg">
                  Cart
                </StorefrontNavLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="sf-eyebrow mb-4">Support</p>
            <ul className="space-y-2.5">
              <li>
                <StorefrontNavLink href={`${base}#about`} className="sf-link text-sm sf-hover-fg">
                  About
                </StorefrontNavLink>
              </li>
              <li>
                <StorefrontNavLink href={`${base}/track`} className="sf-link text-sm sf-hover-fg">
                  Track order
                </StorefrontNavLink>
              </li>
              <li>
                <StorefrontNavLink href={`${base}#contact`} className="sf-link text-sm sf-hover-fg">
                  Contact
                </StorefrontNavLink>
              </li>
              {theme.contact.phone && (
                <li>
                  <a href={`tel:${theme.contact.phone}`} className="sf-link text-sm sf-hover-fg">
                    {theme.contact.phone}
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-6 flex gap-3">
              {theme.social.instagram && (
                <a href={theme.social.instagram} target="_blank" rel="noopener noreferrer" className="sf-link sf-touch-target inline-flex items-center justify-center p-2 sf-hover-fg" aria-label="Instagram">
                  <Instagram className="h-5 w-5" strokeWidth={1.5} />
                </a>
              )}
              {theme.social.twitter && (
                <a href={theme.social.twitter} target="_blank" rel="noopener noreferrer" className="sf-link sf-hover-fg" aria-label="Twitter">
                  <Twitter className="h-5 w-5" strokeWidth={1.5} />
                </a>
              )}
              {theme.social.facebook && (
                <a href={theme.social.facebook} target="_blank" rel="noopener noreferrer" className="sf-link sf-hover-fg" aria-label="Facebook">
                  <Facebook className="h-5 w-5" strokeWidth={1.5} />
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="sf-eyebrow mb-4">Newsletter</p>
            <p className="sf-muted-fg mb-4 text-sm">Exclusive offers and new arrivals.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="sf-input min-w-0 flex-1"
                required
              />
              <Button type="submit" className="sf-btn-primary w-full shrink-0 rounded-full px-5 sm:w-auto">
                Join
              </Button>
            </form>
          </div>
        </div>

        <div className="sf-border mt-14 flex flex-col items-center justify-between gap-3 border-t pt-8 text-xs sf-muted-fg md:flex-row">
          <p>&copy; {new Date().getFullYear()} {store.brandName}</p>
          <p className="sf-eyebrow">Powered by ModenixOS</p>
        </div>
      </div>
    </footer>
  );
}
