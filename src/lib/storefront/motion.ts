/** Shared Framer Motion presets for storefront sections */
export const SF_EASE = [0.22, 1, 0.36, 1] as const;

export const sfFadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.55, ease: SF_EASE },
};

export const sfFadeUpStagger = (index: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: SF_EASE, delay: Math.min(index * 0.07, 0.35) },
});

export const sfScaleIn = {
  initial: { opacity: 0, scale: 0.97 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: SF_EASE },
};
