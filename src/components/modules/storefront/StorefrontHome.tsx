import Link from "next/link";
import Image from "next/image";
import { Product, Store } from "@/types/store.types";
import { StorefrontHeader } from "./StorefrontHeader";

export function ProductCard({ product, slug }: { product: Product; slug: string }) {
  return (
    <Link href={`/store/${slug}/products/${product.id}`} className="group block overflow-hidden rounded-lg border">
      <div className="relative aspect-[3/4] bg-muted">
        {product.images[0] && (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" unoptimized />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-muted-foreground">
          {product.discountPrice ? (
            <><span className="line-through">${product.price}</span> ${product.discountPrice}</>
          ) : (
            `$${product.price.toFixed(2)}`
          )}
        </p>
      </div>
    </Link>
  );
}

export function StorefrontHome({ store, products }: { store: Store; products: Product[] }) {
  const theme = (store.theme ?? {}) as Record<string, string>;
  return (
    <div style={{ "--store-primary": theme.primaryColor, "--store-secondary": theme.secondaryColor } as React.CSSProperties}>
      <StorefrontHeader store={store} />
      <section className="relative bg-muted py-20 text-center">
        {store.banner && (
          <div className="absolute inset-0 opacity-30">
            <Image src={store.banner} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="relative container mx-auto px-4">
          <h1 className="text-4xl font-bold md:text-5xl">{store.brandName}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{store.description}</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-2xl font-bold">Featured Products</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} slug={store.slug} />)}
        </div>
      </section>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {store.brandName}. Powered by ModenixOS.</p>
      </footer>
    </div>
  );
}
