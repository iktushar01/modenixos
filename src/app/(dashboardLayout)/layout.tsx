import { cookies } from "next/headers";
import { Sidebar1 } from "@/components/sidebar1";
import { parseUserCookie } from "@/lib/auth/readUserFromCookie";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const user = parseUserCookie(cookieStore.get("user")?.value);

  return (
    <Sidebar1 className="font-sans" user={user}>
      {children}
    </Sidebar1>
  );
};

export default DashboardLayout;
 