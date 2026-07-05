"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { Category, Collection, Product, Coupon, Order, Customer, Review, AnalyticsOverview, Store } from "@/types/store.types";
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

// Collections
export async function getCollectionsAction(params?: Record<string, unknown>) {
  return httpClient.get<Collection[]>("/collections", { params });
}

export async function createCollectionAction(data: FormData) {
  const res = await httpClient.post<Collection>("/collections", data);
  revalidatePath("/dashboard/collections");
  return res;
}

export async function deleteCollectionAction(id: string) {
  await httpClient.delete(`/collections/${id}`);
  revalidatePath("/dashboard/collections");
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

// Orders
export async function getOrdersAction(params?: Record<string, unknown>) {
  return httpClient.get<Order[]>("/orders", { params });
}

export async function updateOrderStatusAction(id: string, status: string) {
  const res = await httpClient.patch<Order>(`/orders/${id}/status`, { status });
  revalidatePath("/dashboard/orders");
  return res;
}

// Customers
export async function getCustomersAction(params?: Record<string, unknown>) {
  return httpClient.get<Customer[]>("/customers", { params });
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
  const res = await httpClient.get<{ monthlyRevenue: Array<{ month: string; revenue: number }> }>("/analytics/charts");
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
  const res = await httpClient.get<{ stores: number; users: number; orders: number; revenue: number }>("/admin/analytics");
  return res.data;
}

export async function suspendStoreAction(id: string, isSuspended: boolean) {
  await httpClient.patch(`/admin/stores/${id}/suspend`, { isSuspended });
  revalidatePath("/admin/admin-management");
}

// Public
export async function getPublicStoreAction(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}`, {
    next: { revalidate: 60, tags: [`store-public-${slug}`] },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function getPublicProductsAction(slug: string, params?: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/products?${qs}`, { next: { revalidate: 60 } });
  if (!res.ok) return { data: [], meta: null };
  return res.json();
}

export async function getPublicProductAction(slug: string, id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/products/${id}`, {
    next: { revalidate: 60, tags: [`store-product-${slug}-${id}`] },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function getPublicCollectionsAction(slug: string, params?: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/collections?${qs}`, { next: { revalidate: 60 } });
  if (!res.ok) return { data: [], meta: null };
  return res.json();
}

export async function getPublicCategoriesAction(slug: string, params?: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/categories?${qs}`, { next: { revalidate: 60 } });
  if (!res.ok) return { data: [], meta: null };
  return res.json();
}

export async function getPublicReviewsAction(slug: string, params?: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/reviews?${qs}`, { next: { revalidate: 60 } });
  if (!res.ok) return { data: [], meta: null };
  return res.json();
}

export async function placeOrderAction(slug: string, data: Record<string, unknown>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
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
