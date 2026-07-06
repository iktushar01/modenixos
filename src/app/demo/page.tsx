import { redirect } from "next/navigation";
import { DEMO_STORE_PATH } from "@/lib/app-config";

export default function DemoRedirectPage() {
  redirect(DEMO_STORE_PATH);
}
