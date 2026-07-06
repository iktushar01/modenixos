/** Build storefront paths for a store slug */
export function storeBasePath(slug: string) {
  return `/store/${slug}`;
}

export function storeShopPath(slug: string, params?: URLSearchParams | Record<string, string | undefined>) {
  const base = `${storeBasePath(slug)}/shop`;
  if (!params) return base;

  const search =
    params instanceof URLSearchParams
      ? params
      : (() => {
          const p = new URLSearchParams();
          for (const [key, value] of Object.entries(params)) {
            if (value) p.set(key, value);
          }
          return p;
        })();

  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

export function storeCategoryPath(slug: string, categorySlug: string) {
  return `${storeBasePath(slug)}/categories/${categorySlug}`;
}

export function storeCollectionPath(slug: string, collectionSlug: string) {
  return `${storeBasePath(slug)}/collections/${collectionSlug}`;
}

export function storeProductPath(slug: string, productId: string) {
  return `${storeBasePath(slug)}/products/${productId}`;
}

export function storeAboutPath(slug: string) {
  return `${storeBasePath(slug)}/about`;
}

export function storePrivacyPolicyPath(slug: string) {
  return `${storeBasePath(slug)}/privacy-policy`;
}

export function storeShippingPolicyPath(slug: string) {
  return `${storeBasePath(slug)}/shipping-policy`;
}

export function storeReturnExchangePolicyPath(slug: string) {
  return `${storeBasePath(slug)}/return-exchange-policy`;
}

export function storePaymentRefundPolicyPath(slug: string) {
  return `${storeBasePath(slug)}/payment-refund-policy`;
}

export function storeContactUsPath(slug: string) {
  return `${storeBasePath(slug)}/contact-us`;
}

export function storeTrackPath(slug: string) {
  return `${storeBasePath(slug)}/track`;
}
