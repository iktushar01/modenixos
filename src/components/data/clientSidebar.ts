import { SidebarData } from "@/types/sidebar";
import { APP_NAME, LOGO_LIGHT } from "@/lib/app-config";

export const clientSidebarData: SidebarData = {
  logo: {
    src: LOGO_LIGHT,
    alt: `${APP_NAME} logo`,
    title: APP_NAME,
    description: "Brand Dashboard",
  },
  navGroups: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: "LayoutDashboard", href: "/dashboard" },
        { label: "Analytics", icon: "BarChart3", href: "/dashboard/analytics" },
      ],
    },
    {
      title: "Catalog",
      items: [
        { label: "Products", icon: "Package", href: "/dashboard/products" },
        { label: "Categories", icon: "Tags", href: "/dashboard/categories" },
        { label: "Collections", icon: "Layers", href: "/dashboard/collections" },
      ],
    },
    {
      title: "Commerce",
      items: [
        { label: "Orders", icon: "ShoppingCart", href: "/dashboard/orders" },
        { label: "Customers", icon: "Users", href: "/dashboard/customers" },
        { label: "Reviews", icon: "Star", href: "/dashboard/reviews" },
        { label: "Coupons", icon: "Ticket", href: "/dashboard/coupons" },
      ],
    },
    {
      title: "Shop",
      items: [
        { label: "Shop profile", icon: "Store", href: "/dashboard/store" },
        { label: "Branding", icon: "Image", href: "/dashboard/store/branding" },
        { label: "Theme", icon: "LayoutTemplate", href: "/dashboard/store/theme" },
        { label: "Header", icon: "Layers", href: "/dashboard/store/header" },
        { label: "Pages", icon: "FileText", href: "/dashboard/store/pages" },
        { label: "Shipping", icon: "Truck", href: "/dashboard/store/shipping" },
        { label: "Appearance", icon: "Palette", href: "/dashboard/store/appearance" },
      ],
    },
    {
      title: "System",
      items: [
        { label: "Settings", icon: "Settings", href: "/dashboard/settings" },
        { label: "Billing", icon: "CreditCard", href: "/dashboard/settings/billing" },
        { label: "Users & Permissions", icon: "ShieldCheck", href: "/dashboard/settings/users" },
      ],
    },
  ],
};

export const getClientSidebarData = async (): Promise<SidebarData> => clientSidebarData;
