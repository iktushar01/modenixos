import { ComponentType } from "react";
import { Category, Collection, Product, Review, Store } from "@/types/store.types";
import { StorefrontTemplateId, StorefrontThemeConfig } from "@/lib/storefront";
import { AnnouncementBar as Theme1AnnouncementBar } from "./theme1/AnnouncementBar";
import { StoreHeader as Theme1StoreHeader } from "./theme1/StoreHeader";
import { Theme1Home } from "./theme1";
import { Theme1ProductDetail } from "./theme1/product/Theme1ProductDetail";
import { AnnouncementBar as Theme2AnnouncementBar } from "./theme2/AnnouncementBar";
import { StoreHeader as Theme2StoreHeader } from "./theme2/StoreHeader";
import { Theme2Home } from "./theme2";
import { Theme2ProductDetail } from "./theme2/product/Theme2ProductDetail";
import { AnnouncementBar as Theme3AnnouncementBar, Footer as Theme3Footer, StoreHeader as Theme3StoreHeader, Theme3Home } from "./theme3";
import { Theme3ProductDetail } from "./theme3/product/Theme3ProductDetail";
import { StoreFooter as Theme1StoreFooter } from "../StoreFooter";
import { Footer as Theme2Footer } from "./theme2/sections/Footer";

export interface ThemeHomeProps {
  store: Store;
  catalog: Product[];
  categories: Category[];
  collections: Collection[];
  reviews: Review[];
  theme: StorefrontThemeConfig;
}

export interface ThemeShellComponents {
  AnnouncementBar: ComponentType<{ theme: StorefrontThemeConfig }>;
  StoreHeader: ComponentType<{
    store: Store;
    theme: StorefrontThemeConfig;
    categories: Category[];
  }>;
  StoreFooter: ComponentType<{
    store: Store;
    theme: StorefrontThemeConfig;
    categories?: Category[];
  }>;
}

export interface ThemeProductDetailProps {
  store: Store;
  product: Product;
  theme: StorefrontThemeConfig;
  relatedProducts: Product[];
  reviews: Review[];
  isLoggedIn: boolean;
  inWishlist: boolean;
}

const THEME_SHELL: Record<StorefrontTemplateId, ThemeShellComponents> = {
  theme1: {
    AnnouncementBar: Theme1AnnouncementBar,
    StoreHeader: Theme1StoreHeader,
    StoreFooter: Theme1StoreFooter,
  },
  theme2: {
    AnnouncementBar: Theme2AnnouncementBar,
    StoreHeader: Theme2StoreHeader,
    StoreFooter: Theme2Footer,
  },
  theme3: {
    AnnouncementBar: Theme3AnnouncementBar,
    StoreHeader: Theme3StoreHeader,
    StoreFooter: Theme3Footer,
  },
};

const THEME_HOME: Record<StorefrontTemplateId, ComponentType<ThemeHomeProps>> = {
  theme1: Theme1Home,
  theme2: Theme2Home,
  theme3: Theme3Home,
};

const THEME_PRODUCT_DETAIL: Record<StorefrontTemplateId, ComponentType<ThemeProductDetailProps>> = {
  theme1: Theme1ProductDetail,
  theme2: Theme2ProductDetail,
  theme3: Theme3ProductDetail,
};

export function resolveThemeShell(templateId: StorefrontTemplateId): ThemeShellComponents {
  return THEME_SHELL[templateId] ?? THEME_SHELL.theme1;
}

export function resolveThemeHome(templateId: StorefrontTemplateId): ComponentType<ThemeHomeProps> {
  return THEME_HOME[templateId] ?? THEME_HOME.theme1;
}

export function resolveThemeProductDetail(
  templateId: StorefrontTemplateId,
): ComponentType<ThemeProductDetailProps> {
  return THEME_PRODUCT_DETAIL[templateId] ?? THEME_PRODUCT_DETAIL.theme1;
}
