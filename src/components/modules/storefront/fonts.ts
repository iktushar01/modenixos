import { Cormorant_Garamond, DM_Sans } from "next/font/google";

export const sfDisplayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--sf-font-display",
  display: "swap",
});

export const sfBodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--sf-font-body",
  display: "swap",
});

export const storefrontFontClassName = `${sfDisplayFont.variable} ${sfBodyFont.variable}`;
