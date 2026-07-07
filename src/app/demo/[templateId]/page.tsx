import { redirect } from "next/navigation";
import { DEMO_STORE_PATH } from "@/lib/app-config";
import { StorefrontTemplateId } from "@/lib/storefront";

const VALID_TEMPLATES: StorefrontTemplateId[] = ["theme1", "theme2", "theme3"];

export default async function ThemeDemoRedirectPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const resolvedTheme = VALID_TEMPLATES.includes(templateId as StorefrontTemplateId)
    ? templateId
    : "theme1";

  redirect(`${DEMO_STORE_PATH}?previewTheme=${resolvedTheme}`);
}
