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
import { getSidebarData } from "@/lib/getSidebarData";
import { getCookie } from "@/lib/cookieUtils";
import { UserFromCookie } from "@/types/auth.types";
import { cn } from "@/lib/utils";

interface Sidebar1Props {
  className?: string;
  children?: React.ReactNode;
}

const Sidebar1 = async ({ className, children }: Sidebar1Props) => {
  // Read user from cookie server-side
  const userCookie = await getCookie("user");
  let user: UserFromCookie | null = null;

  if (userCookie) {
    try {
      user = JSON.parse(userCookie) as UserFromCookie;
    } catch (error) {
      console.error("Failed to parse user cookie:", error);
    }
  }

  const userRole = user?.role ?? "CLIENT";
  const sidebarData = await getSidebarData(userRole as "ADMIN" | "CLIENT");

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
                <BreadcrumbPage>
                  {sidebarData.logo.description}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DashboardHeader>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {children ?? (
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export { Sidebar1 };
