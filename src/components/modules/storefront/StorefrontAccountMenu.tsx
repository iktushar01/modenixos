"use client";

import { StorefrontNavLink } from "./StorefrontNavLink";
import { useOptionalStorefrontNav } from "./StorefrontNavContext";
import { useRouter } from "next/navigation";
import { Package, Heart, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useOptionalStorefrontCustomer } from "./StorefrontCustomerContext";

interface StorefrontAccountMenuProps {
  base: string;
  className?: string;
}

export function StorefrontAccountMenu({ base, className }: StorefrontAccountMenuProps) {
  const router = useRouter();
  const nav = useOptionalStorefrontNav();
  const ctx = useOptionalStorefrontCustomer();

  if (!ctx) {
    return (
      <StorefrontNavLink href={`${base}/account/login`} className={className} aria-label="Account">
        <User className="h-5 w-5" strokeWidth={1.5} />
      </StorefrontNavLink>
    );
  }

  const { customer, logout, slug } = ctx;

  if (!customer) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className} aria-label="Account">
            <User className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <StorefrontNavLink href={`${base}/account/login`}>Log in</StorefrontNavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <StorefrontNavLink href={`${base}/account/register`}>Create account</StorefrontNavLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className} aria-label="Account menu">
          <User className="h-5 w-5" strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{customer.name}</p>
          <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <StorefrontNavLink href={`/store/${slug}/account/orders`} className="gap-2">
            <Package className="h-4 w-4" />
            Orders
          </StorefrontNavLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <StorefrontNavLink href={`/store/${slug}/account/wishlist`} className="gap-2">
            <Heart className="h-4 w-4" />
            Wishlist
          </StorefrontNavLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <StorefrontNavLink href={`/store/${slug}/track`} className="gap-2">
            Track order
          </StorefrontNavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={async () => {
            await logout();
            if (nav) nav.navigate(base);
            else router.push(base);
          }}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
