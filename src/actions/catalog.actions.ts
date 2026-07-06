"use server";

import { cache } from "react";
import { httpClient } from "@/lib/axios/httpClient";
import { Category, Collection, Product, Coupon, Order, Customer, Review, AnalyticsOverview, AnalyticsCharts, Store } from "@/types/store.types";
import { revalidatePath, revalidateTag } from "next/cache";

async function revalidateStorefront() {
  try {
    const res = await httpClient.get<Store>("/stores/me");
    if (res.data?.slug) {
      revalidateTag(`store-public-${res.data.slug}`);
      revalidatePath(`/store/${res.data.slug}`);
    }
  } catch {
    // Store may not exist yet during onboarding
  }
}

async function revalidateStorefrontProduct(productId: string) {
  try {
    const res = await httpClient.get<Store>("/stores/me");
    const slug = res.data?.slug;
    if (!slug) return;
    revalidateTag(`store-product-${slug}-${productId}`);
    revalidatePath(`/store/${slug}/products/${productId}`);
    revalidatePath(`/store/${slug}`);
  } catch {
    // Store may not exist yet
  }
}

// Categories
export async function getCategoriesAction(params?: Record<string, unknown>) {
  const res = await httpClient.get<Category[]>("/categories", { params });
  return res;
}

export async function createCategoryAction(data: FormData) {
  const res = await httpClient.post<Category>("/categories", data);
  revalidatePath("/dashboard/categories");
  await revalidateStorefront();
  return res;
}

export async function updateCategoryAction(id: string, data: FormData) {
  const res = await httpClient.patch<Category>(`/categories/${id}`, data);
  revalidatePath("/dashboard/categories");
  await revalidateStorefront();
  return res;
}

export async function deleteCategoryAction(id: string) {
  await httpClient.delete(`/categories/${id}`);
  revalidatePath("/dashboard/categories");
  await revalidateStorefront();
}

export async function reorderCategoriesAction(categoryIds: string[]) {
  await httpClient.patch("/categories/reorder", { categoryIds });
  revalidatePath("/dashboard/categories");
  await revalidateStorefront();
}

// Collections
export async function getCollectionsAction(params?: Record<string, unknown>) {
  return httpClient.get<Collection[]>("/collections", { params });
}

export async function createCollectionAction(data: FormData) {
  const res = await httpClient.post<Collection>("/collections", data);
  revalidatePath("/dashboard/collections");
  await revalidateStorefront();
  return res;
}

export async function updateCollectionAction(id: string, data: FormData) {
  const res = await httpClient.patch<Collection>(`/collections/${id}`, data);
  revalidatePath("/dashboard/collections");
  await revalidateStorefront();
  return res;
}

export async function deleteCollectionAction(id: string) {
  await httpClient.delete(`/collections/${id}`);
  revalidatePath("/dashboard/collections");
  await revalidateStorefront();
}

export async function reorderCollectionsAction(collectionIds: string[]) {
  await httpClient.patch("/collections/reorder", { collectionIds });
  revalidatePath("/dashboard/collections");
  await revalidateStorefront();
}

// Products
export async function getProductsAction(params?: Record<string, unknown>) {
  return httpClient.get<Product[]>("/products", { params });
}

export async function getProductAction(id: string) {
  const res = await httpClient.get<Product>(`/products/${id}`);
  return res.data;
}

export async function createProductAction(data: FormData) {
  const res = await httpClient.post<Product>("/products", data);
  revalidatePath("/dashboard/products");
  await revalidateStorefront();
  return res;
}

export async function updateProductAction(id: string, data: FormData) {
  const res = await httpClient.patch<Product>(`/products/${id}`, data);
  revalidatePath("/dashboard/products");
  await revalidateStorefront();
  return res;
}

export async function deleteProductAction(id: string) {
  await httpClient.delete(`/products/${id}`);
  revalidatePath("/dashboard/products");
}

export async function reorderProductsAction(productIds: string[]) {
  await httpClient.patch("/products/reorder", { productIds });
  revalidatePath("/dashboard/products");
}

// Orders
export async function getOrdersAction(params?: Record<string, unknown>) {
  return httpClient.get<Order[]>("/orders", { params });
}

export async function getOrderStatsAction() {
  const res = await httpClient.get<{
    totalConfirmed: number;
    totalAmount: number;
    customersServed: number;
  }>("/orders/stats");
  return res.data;
}

export async function updateOrderStatusAction(
  id: string,
  status: string,
  tracking?: { trackingNumber?: string | null; trackingCarrier?: string | null },
) {
  const res = await httpClient.patch<Order>(`/orders/${id}/status`, { status, ...tracking });
  revalidatePath("/dashboard/orders");
  return res;
}

export async function createDashboardOrderAction(payload: {
  slug: string;
  status: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: Record<string, string>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod?: string;
  orderNote?: string;
  paidAmount?: number;
  markFraud?: boolean;
}) {
  const { slug, status, orderNote: _orderNote, paidAmount: _paidAmount, markFraud: _markFraud, ...orderData } = payload;
  const order = await placeOrderAction(slug, {
    ...orderData,
    paymentMethod: orderData.paymentMethod ?? "COD",
  });

  if (status !== "PENDING") {
    await updateOrderStatusAction(order.id, status);
  }

  revalidatePath("/dashboard/orders");
  return order;
}

// Customers
export async function getCustomersAction(params?: Record<string, unknown>) {
  return httpClient.get<Customer[]>("/customers", { params });
}

export async function getCustomerAction(id: string) {
  return httpClient.get<Customer>(`/customers/${id}`);
}

export async function createCustomerAction(data: {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
}) {
  const res = await httpClient.post<Customer>("/customers", data);
  revalidatePath("/dashboard/customers");
  return res;
}

export async function updateCustomerAction(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string | null;
    password?: string;
    removeAccount?: boolean;
  },
) {
  const res = await httpClient.patch<Customer>(`/customers/${id}`, data);
  revalidatePath("/dashboard/customers");
  revalidatePath(`/dashboard/customers/${id}`);
  return res;
}

export async function deleteCustomerAction(id: string) {
  await httpClient.delete(`/customers/${id}`);
  revalidatePath("/dashboard/customers");
}

// Reviews
export async function getReviewsAction(params?: Record<string, unknown>) {
  return httpClient.get<Review[]>("/reviews", { params });
}

export async function updateReviewAction(id: string, data: { status?: string; reply?: string }) {
  const res = await httpClient.patch<Review>(`/reviews/${id}`, data);
  revalidatePath("/dashboard/reviews");
  if (res.data?.productId) {
    await revalidateStorefrontProduct(res.data.productId);
  }
  return res;
}

export async function deleteReviewAction(id: string, productId: string) {
  await httpClient.delete(`/reviews/${id}`);
  revalidatePath("/dashboard/reviews");
  await revalidateStorefrontProduct(productId);
}

// Coupons
export async function getCouponsAction(params?: Record<string, unknown>) {
  return httpClient.get<Coupon[]>("/coupons", { params });
}

export async function createCouponAction(data: Record<string, unknown>) {
  const res = await httpClient.post<Coupon>("/coupons", data);
  revalidatePath("/dashboard/coupons");
  return res;
}

export async function updateCouponAction(id: string, data: Record<string, unknown>) {
  const res = await httpClient.patch<Coupon>(`/coupons/${id}`, data);
  revalidatePath("/dashboard/coupons");
  return res;
}

export async function deleteCouponAction(id: string) {
  await httpClient.delete(`/coupons/${id}`);
  revalidatePath("/dashboard/coupons");
}

// Analytics
export async function getAnalyticsOverviewAction() {
  const res = await httpClient.get<AnalyticsOverview>("/analytics/overview");
  return res.data;
}

export async function getAnalyticsChartsAction() {
  const res = await httpClient.get<AnalyticsCharts>("/analytics/charts");
  return res.data;
}

// Admin
export async function getAdminStoresAction(params?: Record<string, unknown>) {
  return httpClient.get("/admin/stores", { params });
}

export async function getAdminUsersAction(params?: Record<string, unknown>) {
  return httpClient.get("/admin/users", { params });
}

export async function getAdminAnalyticsAction() {
  const res = await httpClient.get<{
    stores: number;
    users: number;
    orders: number;
    revenue: number;
    mrr?: number;
    arr?: number;
    pastDue?: number;
    activeSubscriptions?: number;
    totalCommission?: number;
    commissionThisMonth?: number;
    earnedOrderCount?: number;
  }>("/admin/analytics");
  return res.data;
}

export async function suspendStoreAction(id: string, isSuspended: boolean) {
  await httpClient.patch(`/admin/stores/${id}/suspend`, { isSuspended });
  revalidatePath("/admin/admin-management");
}

// Public
export const getPublicStoreAction = cache(async (slug: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}`, {
      next: { revalidate: 60, tags: [`store-public-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
});

export async function getPublicProductsAction(slug: string, params?: Record<string, string>) {
  try {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/products?${qs}`, {
      next: { revalidate: 60, tags: [`store-products-${slug}`] },
    });
    if (!res.ok) return { data: [], meta: null };
    return res.json();
  } catch {
    return { data: [], meta: null };
  }
}

export const getPublicProductAction = cache(async (slug: string, id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/products/${id}`, {
      next: { revalidate: 60, tags: [`store-product-${slug}-${id}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
});

export async function getPublicCollectionsAction(slug: string, params?: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/collections?${qs}`, {
    next: { revalidate: 60, tags: [`store-collections-${slug}`] },
  });
  if (!res.ok) return { data: [], meta: null };
  return res.json();
}

export async function getPublicCategoriesAction(slug: string, params?: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/categories?${qs}`, {
    next: { revalidate: 60, tags: [`store-categories-${slug}`] },
  });
  if (!res.ok) return { data: [], meta: null };
  return res.json();
}

export async function getPublicReviewsAction(slug: string, params?: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/reviews?${qs}`, {
    next: { revalidate: 120, tags: [`store-reviews-${slug}`] },
  });
  if (!res.ok) return { data: [], meta: null };
  return res.json();
}

export async function placeOrderAction(slug: string, data: Record<string, unknown>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Failed to place order");
  return json.data as Order;
}

export async function validateCouponAction(slug: string, code: string, subtotal: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, subtotal }),
  });
  if (!res.ok) throw new Error("Invalid coupon");
  const json = await res.json();
  return json.data;
}
