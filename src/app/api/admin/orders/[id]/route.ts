import { NextRequest, NextResponse } from "next/server";
import { getAdminToken } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

// Change an order's status (PENDING -> PREPARING -> SERVED -> COMPLETED, or CANCELLED).
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getAdminToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  if (!body?.status) {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  try {
    const res = await fetch(new URL(`/orders/${id}/status`, BACKEND_URL), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: body.status }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = Array.isArray(data.message) ? data.message[0] : data.message;
      return NextResponse.json(
        { error: message || "Gagal mengubah status pesanan." },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[api/admin/orders/:id] PATCH failed:", err);
    return NextResponse.json({ error: "Gagal menghubungi server." }, { status: 502 });
  }
}
