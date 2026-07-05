"use client";

import { ReactNode } from "react";

interface AccountAuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AccountAuthLayout({ title, subtitle, children }: AccountAuthLayoutProps) {
  return (
    <div className="sf-border sf-card mx-auto w-full max-w-md overflow-hidden border p-8 md:p-10">
      <h1 className="sf-display-lg text-2xl">{title}</h1>
      <p className="sf-muted-fg mt-2 text-sm">{subtitle}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}
