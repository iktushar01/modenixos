"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { Store } from "@/types/store.types";
import { StorefrontThemeConfig } from "@/lib/storefront";

interface AccountAuthLayoutProps {
  store: Store;
  theme?: StorefrontThemeConfig;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AccountAuthLayout({ store, title, subtitle, children }: AccountAuthLayoutProps) {
  return (
    <div className="sf-border mx-auto grid min-h-[70vh] max-w-4xl overflow-hidden border md:grid-cols-2">
      <div className="sf-muted flex flex-col justify-center p-10 md:p-12">
        {store.logo ? (
          <Image src={store.logo} alt={store.brandName} width={140} height={48} className="mb-8 h-10 w-auto object-contain" unoptimized />
        ) : (
          <p className="sf-display-lg mb-6 text-3xl">{store.brandName}</p>
        )}
        <p className="sf-eyebrow">Member access</p>
        <p className="sf-body-lg sf-muted-fg mt-4 max-w-xs leading-relaxed">
          {store.description || `Exclusive access to ${store.brandName} collections and wishlists.`}
        </p>
      </div>
      <div className="sf-card flex flex-col justify-center p-10 md:p-12">
        <h1 className="sf-display-lg text-2xl">{title}</h1>
        <p className="sf-muted-fg mt-2 text-sm">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
