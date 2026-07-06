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
