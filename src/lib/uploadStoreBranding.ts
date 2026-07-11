import { Store } from "@/types/store.types";

interface ApiPayload {
  success?: boolean;
  message?: string;
  data?: Store;
}

/**
 * Upload store branding through a same-origin API route so the request
 * inherits the server-side auth cookies and multipart uploads work reliably.
 */
export async function uploadStoreBranding(storeId: string, formData: FormData): Promise<Store> {
  const response = await fetch(`/api/stores/${storeId}`, {
    method: "PATCH",
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
