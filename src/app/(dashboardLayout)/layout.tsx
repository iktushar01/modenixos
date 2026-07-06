import { Sidebar1 } from "@/components/sidebar1";
 
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <Sidebar1 className="font-sans">{children}</Sidebar1>;
};
 
export default DashboardLayout;
 