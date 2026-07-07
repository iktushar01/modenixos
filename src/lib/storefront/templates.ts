import { StorefrontTemplateId } from "./types";
import { DEMO_STORE_PATH } from "@/lib/app-config";

export interface StorefrontTemplateOption {
  id: StorefrontTemplateId;
  label: string;
  description: string;
  demoUrl: string;
  available: boolean;
}

const TEMPLATE_DEMO_PATHS: Record<StorefrontTemplateId, string> = {
  theme1: process.env.NEXT_PUBLIC_THEME1_DEMO_PATH ?? DEMO_STORE_PATH,
  theme2: process.env.NEXT_PUBLIC_THEME2_DEMO_PATH ?? DEMO_STORE_PATH,
  theme3: process.env.NEXT_PUBLIC_THEME3_DEMO_PATH ?? DEMO_STORE_PATH,
};

export const STOREFRONT_TEMPLATES: StorefrontTemplateOption[] = [
  {
    id: "theme1",
    label: "Classic Retail",
    description: "Clean layout with hero, categories, and product grids.",
    demoUrl: TEMPLATE_DEMO_PATHS.theme1,
    available: true,
  },
  {
    id: "theme2",
    label: "Editorial",
    description: "Magazine-style layout with editorial sections, bento grids, and list catalog.",
    demoUrl: TEMPLATE_DEMO_PATHS.theme2,
    available: true,
  },
  {
    id: "theme3",
    label: "Gallery Luxe",
    description: "Gallery-first storytelling layout with curated rows and immersive highlights.",
    demoUrl: TEMPLATE_DEMO_PATHS.theme3,
    available: true,
  },
];

export function getStorefrontTemplateById(id: StorefrontTemplateId): StorefrontTemplateOption | undefined {
  return STOREFRONT_TEMPLATES.find((template) => template.id === id);
}
