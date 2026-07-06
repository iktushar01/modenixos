"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/modules/products/ProductForm";
import { getProductAction } from "@/actions/catalog.actions";
import { ProductFormSkeleton } from "@/components/modules/products/ProductFormSkeleton";
import { DashboardAsyncContent } from "@/components/shared/DashboardAsyncContent";
import { useDashboardQuery } from "@/hooks/useDashboardQuery";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: product, isPending, isError } = useDashboardQuery({
    queryKey: ["product", id],
    queryFn: () => getProductAction(id),
    enabled: Boolean(id),
  });

  if (isError && !product) {
    return (
      <div className="py-20 text-center text-muted-foreground">Product not found.</div>
    );
  }

  return (
    <DashboardAsyncContent
      showPlaceholder={isPending && !product}
      skeleton={<ProductFormSkeleton />}
    >
      {product ? <ProductForm mode="edit" product={product} /> : null}
    </DashboardAsyncContent>
  );
}
