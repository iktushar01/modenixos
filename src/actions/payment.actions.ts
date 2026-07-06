"use server";

export async function createSslPaymentAction(slug: string, data: Record<string, unknown>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/stores/${slug}/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, paymentMethod: "SSLCOMMERZ" }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Failed to start payment");
  return json.data as {
    paymentUrl: string;
    orderId: string;
    orderNumber: string;
    transactionId: string;
  };
}
