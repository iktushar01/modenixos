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

export function storeCheckoutPath(slug: string) {
  return `${storeBasePath(slug)}/checkout`;
}

export function storeCartPath(slug: string) {
  return `${storeBasePath(slug)}/cart`;
}

export function storeOrderConfirmationPath(
  slug: string,
  params: { order: string; email: string; tranId?: string },
) {
  const search = new URLSearchParams({
    order: params.order,
    email: params.email,
  });
  if (params.tranId) search.set("tran_id", params.tranId);
  return `${storeBasePath(slug)}/orders/confirmation?${search.toString()}`;
}

export function storePaymentFailedPath(slug: string, params?: { order?: string; tranId?: string }) {
  const search = new URLSearchParams();
  if (params?.order) search.set("order", params.order);
  if (params?.tranId) search.set("tran_id", params.tranId);
  const qs = search.toString();
  return qs ? `${storeBasePath(slug)}/payment/failed?${qs}` : `${storeBasePath(slug)}/payment/failed`;
}

export function storePaymentCancelledPath(slug: string, params?: { order?: string; tranId?: string }) {
  const search = new URLSearchParams();
  if (params?.order) search.set("order", params.order);
  if (params?.tranId) search.set("tran_id", params.tranId);
  const qs = search.toString();
  return qs ? `${storeBasePath(slug)}/payment/cancelled?${qs}` : `${storeBasePath(slug)}/payment/cancelled`;
}

export function getPublicInvoiceApiUrl(slug: string, orderNumber: string, email: string) {
  const params = new URLSearchParams({ email });
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/orders/${encodeURIComponent(orderNumber)}/invoice?${params}`;
}
