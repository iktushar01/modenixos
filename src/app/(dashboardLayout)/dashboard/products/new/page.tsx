"use client";

import ProductForm from "@/components/modules/products/ProductForm";
import { useDashboardReady } from "@/components/shared/DashboardRouteTemplate";

export default function NewProductPage() {
  useDashboardReady(true);
  return <ProductForm mode="create" />;
}
