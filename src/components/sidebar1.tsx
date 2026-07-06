"use client";

import { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/modules/dashboard/Sidebar";
import { DashboardHeader } from "@/components/modules/dashboard/DashboardHeader";
import { adminSidebar } from "@/components/data/adminSidebar";
import { clientSidebarData } from "@/components/data/clientSidebar";
import { UserFromCookie } from "@/types/auth.types";
import { cn } from "@/lib/utils";
import { DashboardNavProvider } from "@/components/shared/DashboardNavContext";
import { DashboardNavContent } from "@/components/shared/DashboardNavContent";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";

interface DashboardLayoutClientProps {
  className?: string;
  children?: React.ReactNode;
  user?: UserFromCookie | null;
}

function getSidebarDataForRole(role: UserFromCookie["role"] | undefined) {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return adminSidebar;
  }
  return clientSidebarData;
}

export function DashboardLayoutClient({
  className,
  children,
  user = null,
}: DashboardLayoutClientProps) {
  const sidebarData = useMemo(() => getSidebarDataForRole(user?.role), [user?.role]);

  return (
    <DashboardNavProvider>
      <SidebarProvider className={cn(className)}>
        <AppSidebar data={sidebarData} user={user} />

        <SidebarInset className="admin-shell">
          <DashboardHeader>
            <SidebarTrigger className="-ml-1 size-8 rounded-lg border border-transparent transition-colors hover:border-border/60 hover:bg-muted/60" />
            <Separator
              orientation="vertical"
              className="mr-1 hidden h-5 sm:block"
            />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="gap-1 sm:gap-1.5">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/dashboard"
                    className="rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-muted/60 hover:text-foreground sm:text-sm"
                  >
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="truncate rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary sm:text-sm">
                    {sidebarData.logo.description}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </DashboardHeader>

          <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
            <DashboardPageTransition>
              <DashboardNavContent>{children}</DashboardNavContent>
            </DashboardPageTransition>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardNavProvider>
  );
}

export { DashboardLayoutClient as Sidebar1 };
