import { Category } from "@/types/store.types";

export type ProductTypeKey =
  | "fashion"
  | "shoes"
  | "electronics"
  | "car"
  | "furniture"
  | "books"
  | "digital"
  | "accessories"
  | "general";

export type AttributeFieldType = "text" | "number" | "select" | "tags";

export interface AttributeDefinition {
  key: string;
  label: string;
  type: AttributeFieldType;
  placeholder?: string;
  options?: string[];
  presets?: string[];
  required?: boolean;
}

export interface VariantAttributeDefinition extends AttributeDefinition {
  allowCustom?: boolean;
}

export interface ProductTypeConfig {
  label: string;
  slugPatterns: RegExp[];
  categoryFields: AttributeDefinition[];
  variantAttributes: VariantAttributeDefinition[];
  features: {
    sizeChart: boolean;
    colorImages: boolean;
    careInstructions: boolean;
    shipping: boolean;
    condition: boolean;
    weightDimensions: boolean;
  };
}

const FASHION_SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOR_PRESETS = ["Black", "White", "Navy", "Beige", "Red", "Green", "Gray"];
const SHOE_SIZE_PRESETS = ["6", "7", "8", "9", "10", "11", "12"];

export const PRODUCT_TYPE_CONFIGS: Record<ProductTypeKey, ProductTypeConfig> = {
  fashion: {
    label: "Fashion",
    slugPatterns: [/fashion|clothing|apparel|shirt|dress|pant|jean|jacket|hoodie|tee|top|wear/i],
    categoryFields: [
      { key: "material", label: "Material", type: "text", placeholder: "e.g. 100% Cotton" },
      {
        key: "gender",
        label: "Gender",
        type: "select",
        options: ["Men", "Women", "Unisex", "Kids"],
      },
      {
        key: "fit",
        label: "Fit",
        type: "select",
        options: ["Slim", "Regular", "Relaxed", "Oversized"],
      },
    ],
    variantAttributes: [
      { key: "size", label: "Size", type: "tags", presets: FASHION_SIZE_PRESETS },
      { key: "color", label: "Color", type: "tags", presets: COLOR_PRESETS },
      { key: "material", label: "Material", type: "tags", allowCustom: true },
    ],
    features: {
      sizeChart: true,
      colorImages: true,
      careInstructions: true,
      shipping: true,
      condition: true,
      weightDimensions: true,
    },
  },
  shoes: {
    label: "Shoes",
    slugPatterns: [/shoe|footwear|sneaker|boot|sandal|heel/i],
    categoryFields: [
      { key: "material", label: "Material", type: "text", placeholder: "e.g. Leather, Mesh" },
    ],
    variantAttributes: [
      { key: "shoeSize", label: "Shoe Size", type: "tags", presets: SHOE_SIZE_PRESETS },
      { key: "color", label: "Color", type: "tags", presets: COLOR_PRESETS },
      { key: "material", label: "Material", type: "tags", allowCustom: true },
    ],
    features: {
      sizeChart: false,
      colorImages: true,
      careInstructions: true,
      shipping: true,
      condition: true,
      weightDimensions: true,
    },
  },
  electronics: {
    label: "Electronics",
    slugPatterns: [/electronic|gadget|phone|laptop|computer|tablet|tv|audio|camera/i],
    categoryFields: [
      { key: "model", label: "Model", type: "text", placeholder: "e.g. Galaxy S24" },
      { key: "warranty", label: "Warranty", type: "text", placeholder: "e.g. 1 year" },
      { key: "voltage", label: "Voltage", type: "text", placeholder: "e.g. 110-240V" },
      { key: "weight", label: "Weight", type: "text", placeholder: "e.g. 1.2 kg" },
      {
        key: "dimensions",
        label: "Dimensions",
        type: "text",
        placeholder: "e.g. 30 x 20 x 5 cm",
      },
    ],
    variantAttributes: [
      { key: "ram", label: "RAM", type: "tags", presets: ["4GB", "8GB", "16GB", "32GB"] },
      { key: "storage", label: "Storage", type: "tags", presets: ["64GB", "128GB", "256GB", "512GB", "1TB"] },
      { key: "color", label: "Color", type: "tags", presets: COLOR_PRESETS },
    ],
    features: {
      sizeChart: false,
      colorImages: true,
      careInstructions: false,
      shipping: true,
      condition: true,
      weightDimensions: true,
    },
  },
  car: {
    label: "Car",
    slugPatterns: [/car|vehicle|automobile|auto|suv|sedan|truck|motor/i],
    categoryFields: [
      { key: "manufacturer", label: "Manufacturer", type: "text", placeholder: "e.g. Toyota" },
      { key: "model", label: "Model", type: "text", placeholder: "e.g. Camry" },
      { key: "year", label: "Year", type: "number", placeholder: "e.g. 2024" },
      {
        key: "fuelType",
        label: "Fuel Type",
        type: "select",
        options: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
      },
      {
        key: "transmission",
        label: "Transmission",
        type: "select",
        options: ["Manual", "Automatic", "CVT", "DCT"],
      },
      { key: "engine", label: "Engine", type: "text", placeholder: "e.g. 2.0L Turbo" },
      { key: "mileage", label: "Mileage", type: "text", placeholder: "e.g. 45,000 km" },
      { key: "vin", label: "VIN", type: "text", placeholder: "Vehicle identification number" },
      { key: "exteriorColor", label: "Exterior Color", type: "text", placeholder: "e.g. Pearl White" },
    ],
    variantAttributes: [],
    features: {
      sizeChart: false,
      colorImages: false,
      careInstructions: false,
      shipping: false,
      condition: true,
      weightDimensions: false,
    },
  },
  furniture: {
    label: "Furniture",
    slugPatterns: [/furniture|sofa|chair|table|desk|bed|cabinet|shelf/i],
    categoryFields: [
      { key: "material", label: "Material", type: "text", placeholder: "e.g. Solid Oak" },
      {
        key: "dimensions",
        label: "Dimensions",
        type: "text",
        placeholder: "e.g. 200 x 90 x 85 cm",
      },
      { key: "weight", label: "Weight", type: "text", placeholder: "e.g. 45 kg" },
    ],
    variantAttributes: [
      { key: "color", label: "Color", type: "tags", presets: COLOR_PRESETS },
      { key: "material", label: "Material", type: "tags", allowCustom: true },
    ],
    features: {
      sizeChart: false,
      colorImages: true,
      careInstructions: false,
      shipping: true,
      condition: true,
      weightDimensions: true,
    },
  },
  books: {
    label: "Books",
    slugPatterns: [/book|novel|magazine|publication|ebook/i],
    categoryFields: [
      { key: "author", label: "Author", type: "text" },
      { key: "isbn", label: "ISBN", type: "text" },
      { key: "publisher", label: "Publisher", type: "text" },
      { key: "pages", label: "Pages", type: "number" },
      { key: "language", label: "Language", type: "text", placeholder: "e.g. English" },
      {
        key: "format",
        label: "Format",
        type: "select",
        options: ["Hardcover", "Paperback", "E-book", "Audiobook"],
      },
    ],
    variantAttributes: [
      {
        key: "format",
        label: "Format",
        type: "tags",
        presets: ["Hardcover", "Paperback", "E-book"],
      },
    ],
    features: {
      sizeChart: false,
      colorImages: false,
      careInstructions: false,
      shipping: true,
      condition: true,
      weightDimensions: true,
    },
  },
  digital: {
    label: "Digital Products",
    slugPatterns: [/digital|software|license|subscription|download|template/i],
    categoryFields: [
      { key: "licenseType", label: "License Type", type: "text", placeholder: "e.g. Single user" },
      { key: "deliveryMethod", label: "Delivery Method", type: "text", placeholder: "e.g. Email download link" },
    ],
    variantAttributes: [
      {
        key: "plan",
        label: "Plan",
        type: "tags",
        presets: ["Basic", "Pro", "Enterprise"],
      },
    ],
    features: {
      sizeChart: false,
      colorImages: false,
      careInstructions: false,
      shipping: false,
      condition: false,
      weightDimensions: false,
    },
  },
  accessories: {
    label: "Accessories",
    slugPatterns: [/accessor|bag|wallet|belt|watch|jewel|hat|scarf/i],
    categoryFields: [
      { key: "material", label: "Material", type: "text" },
    ],
    variantAttributes: [
      { key: "color", label: "Color", type: "tags", presets: COLOR_PRESETS },
      { key: "size", label: "Size", type: "tags", presets: ["One Size", "S", "M", "L"] },
    ],
    features: {
      sizeChart: false,
      colorImages: true,
      careInstructions: false,
      shipping: true,
      condition: true,
      weightDimensions: true,
    },
  },
  general: {
    label: "General",
    slugPatterns: [],
    categoryFields: [],
    variantAttributes: [
      { key: "color", label: "Color", type: "tags", presets: COLOR_PRESETS, allowCustom: true },
      { key: "size", label: "Size", type: "tags", allowCustom: true },
    ],
    features: {
      sizeChart: false,
      colorImages: true,
      careInstructions: false,
      shipping: true,
      condition: true,
      weightDimensions: true,
    },
  },
};

const PRODUCT_TYPE_ORDER: ProductTypeKey[] = [
  "fashion",
  "shoes",
  "electronics",
  "car",
  "furniture",
  "books",
  "digital",
  "accessories",
  "general",
];

export function resolveProductType(category?: Category | null): ProductTypeKey {
  if (!category) return "general";
  const haystack = `${category.slug} ${category.name}`;
  for (const key of PRODUCT_TYPE_ORDER) {
    if (key === "general") continue;
    const config = PRODUCT_TYPE_CONFIGS[key];
    if (config.slugPatterns.some((pattern) => pattern.test(haystack))) {
      return key;
    }
  }
  return "general";
}

export function getProductTypeConfig(type: ProductTypeKey): ProductTypeConfig {
  return PRODUCT_TYPE_CONFIGS[type];
}

export function supportsVariants(type: ProductTypeKey): boolean {
  return PRODUCT_TYPE_CONFIGS[type].variantAttributes.length > 0;
}
