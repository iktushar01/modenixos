import { StoreSettingsNav } from "@/components/modules/store/StoreSettingsNav";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-page pb-24 sm:pb-0">
      <StoreSettingsNav />
      {children}
    </div>
  );
}
