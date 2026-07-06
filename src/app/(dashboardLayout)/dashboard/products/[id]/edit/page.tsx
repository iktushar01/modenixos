"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ProductForm from "@/components/modules/products/ProductForm";
import { getProductAction } from "@/actions/catalog.actions";
import { useDashboardReady } from "@/components/shared/DashboardRouteTemplate";
import { ProductFormSkeleton } from "@/components/modules/products/ProductFormSkeleton";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductAction(id),
    enabled: Boolean(id),
  });

  useDashboardReady(!isLoading);

  if (isLoading) {
    return <ProductFormSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Product not found.
      </div>
    );
  }

  return <ProductForm mode="edit" product={product} />;
}
