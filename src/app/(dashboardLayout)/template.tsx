import { DashboardRouteTemplate } from "@/components/shared/DashboardRouteTemplate";

export default function DashboardRouteTemplatePage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardRouteTemplate>{children}</DashboardRouteTemplate>;
}
