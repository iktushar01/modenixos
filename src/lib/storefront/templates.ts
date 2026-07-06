import { StorefrontTemplateId } from "./types";

export interface StorefrontTemplateOption {
  id: StorefrontTemplateId;
  label: string;
  description: string;
  available: boolean;
}

export const STOREFRONT_TEMPLATES: StorefrontTemplateOption[] = [
  {
    id: "theme1",
    label: "Classic Retail",
    description: "Clean layout with hero, categories, and product grids.",
    available: true,
  },
  {
    id: "theme2",
    label: "Editorial",
    description: "Magazine-style layout with editorial sections, bento grids, and list catalog.",
    available: true,
  },
];

export function getStorefrontTemplateById(id: StorefrontTemplateId): StorefrontTemplateOption | undefined {
  return STOREFRONT_TEMPLATES.find((template) => template.id === id);
}
