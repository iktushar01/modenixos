import { SidebarData } from "@/types/sidebar";
import { APP_NAME, LOGO_LIGHT } from "@/lib/app-config";

export const adminSidebar: SidebarData = {
  logo: {
    src: LOGO_LIGHT,
    alt: `${APP_NAME} logo`,
    title: APP_NAME,
    description: "Admin Panel",
  },
  navGroups: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard",      icon: "LayoutDashboard", href: "/admin/dashboard" },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Platform", icon: "ShieldCheck", href: "/admin/admin-management" },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Settings", icon: "Settings", href: "/admin/dashboard/settings" },
      ],
    },
  ],
};
