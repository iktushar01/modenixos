import OrderDetailPageClient from "@/components/modules/storefront/pages/OrderDetailPageClient";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return <OrderDetailPageClient orderNumber={orderNumber} />;
}
