"use client";

import { useMemo } from "react";
import { getCookie } from "cookies-next";
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

interface DashboardLayoutClientProps {
  className?: string;
  children?: React.ReactNode;
}

function readUserFromCookie(): UserFromCookie | null {
  const userCookie = getCookie("user");
  if (!userCookie || typeof userCookie !== "string") return null;

  try {
    return JSON.parse(userCookie) as UserFromCookie;
  } catch {
    return null;
  }
}

function getSidebarDataForRole(role: UserFromCookie["role"] | undefined) {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return adminSidebar;
  }
  return clientSidebarData;
}

export function DashboardLayoutClient({ className, children }: DashboardLayoutClientProps) {
  const user = useMemo(() => readUserFromCookie(), []);
  const sidebarData = useMemo(() => getSidebarDataForRole(user?.role), [user?.role]);

  return (
    <SidebarProvider className={cn(className)}>
      <AppSidebar data={sidebarData} user={user} />

      <SidebarInset>
        <DashboardHeader>
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{sidebarData.logo.description}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashboardHeader>

        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { DashboardLayoutClient as Sidebar1 };
