"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/modules/products/ProductForm";
import { getProductAction } from "@/actions/catalog.actions";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductAction(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
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
