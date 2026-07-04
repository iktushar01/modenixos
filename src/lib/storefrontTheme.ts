import { Store } from "@/types/store.types";

export interface StorefrontSections {
  collections: boolean;
  featured: boolean;
  trending: boolean;
  promo: boolean;
  brandStory: boolean;
  reviews: boolean;
  newsletter: boolean;
}

export interface StorefrontThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  heroHeadline: string;
  heroSubtext: string;
  promoText: string;
  promoEnabled: boolean;
  brandStoryTitle: string;
  brandStoryContent: string;
  brandStoryImage: string | null;
  newsletterEnabled: boolean;
  sections: StorefrontSections;
  social: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

const defaultSections: StorefrontSections = {
  collections: true,
  featured: true,
  trending: true,
  promo: true,
  brandStory: true,
  reviews: true,
  newsletter: true,
};

export function parseStorefrontTheme(store: Store): StorefrontThemeConfig {
  const raw = (store.theme ?? {}) as Record<string, unknown>;
  const sectionsRaw = (raw.sections ?? {}) as Partial<StorefrontSections>;
  const social = (raw.social ?? {}) as StorefrontThemeConfig["social"];

  return {
    primaryColor: (raw.primaryColor as string) ?? "#f5f5f5",
    secondaryColor: (raw.secondaryColor as string) ?? "#c9a962",
    heroHeadline: (raw.heroHeadline as string) ?? store.brandName,
    heroSubtext: (raw.heroSubtext as string) ?? store.description ?? "Curated fashion for the modern wardrobe.",
    promoText: (raw.promoText as string) ?? "",
    promoEnabled: raw.promoEnabled !== false,
    brandStoryTitle: (raw.brandStoryTitle as string) ?? `The ${store.brandName} Story`,
    brandStoryContent:
      (raw.brandStoryContent as string) ??
      store.description ??
      "Crafted with intention. Designed for those who appreciate quality, detail, and timeless style.",
    brandStoryImage: (raw.brandStoryImage as string) ?? store.banner ?? null,
    newsletterEnabled: raw.newsletterEnabled !== false,
    sections: { ...defaultSections, ...sectionsRaw },
    social,
  };
}

export function formatPrice(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function productDisplayPrice(product: { price: number; discountPrice?: number | null }) {
  const sale = product.discountPrice ?? null;
  return {
    price: sale ?? product.price,
    compareAt: sale ? product.price : null,
    discountPercent:
      sale && sale < product.price
        ? Math.round((1 - sale / product.price) * 100)
        : null,
  };
}
