import { StoreSettingsNav } from "@/components/modules/store/StoreSettingsNav";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <StoreSettingsNav />
      {children}
    </div>
  );
}
