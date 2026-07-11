import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "@/lib/axios/httpClient";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> },
) {
  try {
    const { storeId } = await params;
    const formData = await request.formData();

    const response = await httpClient.patch(`/stores/${storeId}`, formData);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const message = error?.response?.data?.message || error?.message || "Store update failed";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}
