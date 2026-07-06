"use client";

import Image from "next/image";
import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { StorefrontOrdersSkeleton } from "@/components/modules/storefront/skeletons";
import { getStoreStaticPage } from "@/lib/storefront/storeStaticPages";
import { parseStorefrontTheme, resolveStoreLogo } from "@/lib/storefront";
import { useStorefrontTheme } from "@/components/modules/storefront/StorefrontThemeContext";
import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import { storeBasePath, storeShopPath } from "@/lib/storePaths";
import { StorefrontCTA } from "@/components/modules/storefront/ui";
import { Store } from "@/types/store.types";
import { ChevronRight, Sparkles } from "lucide-react";

export default function AboutPageClient() {
  const { store, categories, storeReady } = useStorefront();

  if (!storeReady || !store) {
    return <StorefrontOrdersSkeleton />;
  }

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <AboutPageContent store={store} />
    </StorefrontPageShell>
  );
}

function AboutPageContent({ store }: { store: Store }) {
  const { colorMode } = useStorefrontTheme();
  const page = getStoreStaticPage(store.brandName, "about");
  const theme = parseStorefrontTheme(store);
  const base = storeBasePath(store.slug);
  const logoUrl = resolveStoreLogo(store, theme, colorMode);
  const hasImage = Boolean(theme.brandStoryImage);
  const initial = store.brandName.charAt(0).toUpperCase();

  return (
    <main className="sf-section w-full py-12 md:py-16">
        <nav className="sf-muted-fg mb-8 flex flex-wrap items-center gap-1.5 text-xs">
          <StorefrontNavLink href={base} className="sf-link sf-hover-fg transition-colors">
            Home
          </StorefrontNavLink>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <span>About</span>
        </nav>

        <div className="sf-border sf-promo-panel mb-12 overflow-hidden border">
          <div className="grid items-stretch lg:grid-cols-2">
            {hasImage ? (
              <div className="relative min-h-[280px] lg:min-h-[400px]">
                <Image
                  src={theme.brandStoryImage!}
                  alt={store.brandName}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--sf-bg)_50%,transparent)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[color-mix(in_srgb,var(--sf-card)_40%,transparent)]" />
              </div>
            ) : (
              <div className="sf-brand-placeholder relative flex min-h-[240px] items-center justify-center lg:min-h-[400px]">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={store.brandName}
                    width={200}
                    height={80}
                    className="h-16 w-auto object-contain opacity-80 md:h-20"
                    unoptimized
                  />
                ) : (
                  <span className="sf-display-lg select-none text-7xl opacity-20" aria-hidden>
                    {initial}
                  </span>
                )}
              </div>
            )}
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12 md:py-14">
              <p className="sf-eyebrow">{page.eyebrow}</p>
              <h1 className="sf-display-lg mt-3 text-3xl md:text-4xl">{page.title}</h1>
              <p className="sf-muted-fg sf-body-lg mt-5 leading-relaxed">{page.description}</p>
              <div className="mt-8">
                <StorefrontCTA href={storeShopPath(store.slug)}>Shop the collection</StorefrontCTA>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {page.sections.map((section) => (
            <article key={section.title} className="sf-editorial-card p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--sf-muted)]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-medium">{section.title}</h2>
              </div>
              {section.paragraphs && (
                <div className="sf-muted-fg space-y-3 text-sm leading-relaxed md:text-[15px]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              )}
              {section.bullets && (
                <ul className="sf-muted-fg mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed marker:text-[var(--sf-accent)] md:text-[15px]">
                  {section.bullets.map((bullet) => (
                    <li key={bullet.slice(0, 40)}>{bullet}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </main>
  );
}
