import { redirect } from "next/navigation";
import { THEME_DEMO_PATHS } from "@/lib/app-config";

export default function DemoRedirectPage() {
  redirect(THEME_DEMO_PATHS.theme1);
}
