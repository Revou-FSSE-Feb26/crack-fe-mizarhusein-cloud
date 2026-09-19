import { NextRequest, NextResponse } from "next/server";
import { getUserToken } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

// Cancel one of the logged-in customer's own reservations.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getUserToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const res = await fetch(new URL(`/reservations/me/${id}`, BACKEND_URL), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = Array.isArray(data.message) ? data.message[0] : data.message;
      return NextResponse.json(
        { error: message || "Gagal membatalkan reservasi." },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[api/reservation/me/:id] DELETE failed:", err);
    return NextResponse.json(
      { error: "Gagal menghubungi server." },
      { status: 502 }
    );
  }
}
