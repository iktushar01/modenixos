import { getStorefrontSkeletonVariant } from "@/lib/storefront/navigation";
import { StorefrontAuthSkeleton } from "./StorefrontAuthSkeleton";
import { StorefrontCartSkeleton } from "./StorefrontCartSkeleton";
import { StorefrontCheckoutSkeleton } from "./StorefrontCheckoutSkeleton";
import { StorefrontHomeSkeleton } from "./StorefrontHomeSkeleton";
import { StorefrontOrdersSkeleton } from "./StorefrontOrdersSkeleton";
import { StorefrontProductSkeleton } from "./StorefrontProductSkeleton";
import { StorefrontWishlistSkeleton } from "./StorefrontWishlistSkeleton";

export function getStorefrontSkeletonForPath(pathname: string) {
  const variant = getStorefrontSkeletonVariant(pathname);

  switch (variant) {
    case "product":
      return <StorefrontProductSkeleton />;
    case "cart":
      return <StorefrontCartSkeleton />;
    case "checkout":
      return <StorefrontCheckoutSkeleton />;
    case "auth-login":
      return <StorefrontAuthSkeleton fieldCount={2} />;
    case "auth-register":
      return <StorefrontAuthSkeleton fieldCount={3} />;
    case "wishlist":
      return <StorefrontWishlistSkeleton />;
    case "orders":
      return <StorefrontOrdersSkeleton />;
    case "home":
    default:
      return <StorefrontHomeSkeleton />;
  }
}
