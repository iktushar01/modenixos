import { Store } from "@/types/store.types";

interface ApiPayload {
  success?: boolean;
  message?: string;
  data?: Store;
}

/**
 * Upload store branding (logo / hero slides) directly from the browser.
 * Avoids Next.js Server Action multipart corruption on v15.5+.
 */
export async function uploadStoreBranding(storeId: string, formData: FormData): Promise<Store> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${baseUrl}/stores/${storeId}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  let payload: ApiPayload = {};
  try {
    payload = (await response.json()) as ApiPayload;
  } catch {
    // non-json error body
  }

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || `Upload failed (${response.status})`);
  }

  return payload.data;
}
