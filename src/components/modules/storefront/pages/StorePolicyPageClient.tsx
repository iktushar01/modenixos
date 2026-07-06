"use client";

import { useStorefront } from "@/components/modules/storefront/StorefrontContext";
import { StorefrontPageShell } from "@/components/modules/storefront/StorefrontPageShell";
import { getStoreStaticPage, StoreStaticPageId } from "@/lib/storefront/storeStaticPages";
import { StorefrontNavLink } from "@/components/modules/storefront/StorefrontNavLink";
import { storeBasePath } from "@/lib/storePaths";
import { Calendar, ChevronRight } from "lucide-react";

interface StorePolicyPageClientProps {
  pageId: Exclude<StoreStaticPageId, "about" | "contact-us">;
}

export default function StorePolicyPageClient({ pageId }: StorePolicyPageClientProps) {
  const { store, categories, storeReady } = useStorefront();

  if (!storeReady || !store) {
    return null;
  }

  const page = getStoreStaticPage(store.brandName, pageId, store.theme);
  const base = storeBasePath(store.slug);

  return (
    <StorefrontPageShell store={store} categories={categories}>
      <main className="sf-section w-full py-12 md:py-16">
        <nav className="sf-muted-fg mb-8 flex flex-wrap items-center gap-1.5 text-xs">
          <StorefrontNavLink href={base} className="sf-link sf-hover-fg transition-colors">
            Home
          </StorefrontNavLink>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <span>{page.title}</span>
        </nav>

        <div className="mx-auto max-w-3xl">
          <header className="mb-10 md:mb-12">
            <p className="sf-eyebrow">{page.eyebrow}</p>
            <h1 className="sf-display-lg mt-2 text-3xl md:text-4xl">{page.title}</h1>
            <p className="sf-muted-fg sf-body-lg mt-4 leading-relaxed">{page.description}</p>
            <p className="sf-muted-fg mt-4 flex items-center gap-2 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              Last updated {page.lastUpdated}
            </p>
          </header>

          <div className="space-y-6">
            {page.sections.map((section, index) => (
              <article
                key={section.title}
                className="sf-editorial-card p-6 md:p-8"
              >
                <div className="mb-4 flex items-start gap-4">
                  <span className="sf-eyebrow flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sf-muted)] text-[10px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-lg font-medium leading-snug md:text-xl">{section.title}</h2>
                </div>
                {section.paragraphs && (
                  <div className="sf-muted-fg space-y-3 pl-12 text-sm leading-relaxed md:text-[15px]">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>
                )}
                {section.bullets && (
                  <ul className="sf-muted-fg mt-1 list-disc space-y-2 pl-[3.25rem] text-sm leading-relaxed marker:text-[var(--sf-accent)] md:text-[15px]">
                    {section.bullets.map((bullet) => (
                      <li key={bullet.slice(0, 40)}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </main>
    </StorefrontPageShell>
  );
}
