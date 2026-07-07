export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "ModenixOS";

/** Pre-seeded demo store slug — used for landing CTAs and /demo redirect */
export const DEMO_STORE_SLUG = process.env.NEXT_PUBLIC_DEMO_STORE_SLUG ?? "luxe-threads";

export const DEMO_STORE_PATH = `/store/${DEMO_STORE_SLUG}`;
export const THEME_DEMO_PATHS = {
  theme1: "/demo/theme1",
  theme2: "/demo/theme2",
  theme3: "/demo/theme3",
} as const;

export const LOGO_DARK =
  "https://res.cloudinary.com/dfoqasqnw/image/upload/v1783242258/ChatGPT_Image_Jul_5_2026_02_59_36_PM_nrtgn1.png";

export const LOGO_LIGHT =
  "https://res.cloudinary.com/dfoqasqnw/image/upload/v1783242258/ChatGPT_Image_Jul_5_2026_02_59_43_PM_gqnqoz.png";

/** Default tab icon for storefront routes when a store has no uploaded logo. */
export const STORE_FAVICON = "/store-favicon.ico";
