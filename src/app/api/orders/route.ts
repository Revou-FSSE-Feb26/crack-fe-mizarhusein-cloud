import { NextRequest, NextResponse } from "next/server";
import { getUserToken } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

interface OrderLineInput {
  menuId?: number;
  quantity?: number;
  notes?: string;
}

// Public: guests order from the digital menu without an account. If the visitor
// happens to be logged in, their token is forwarded so the backend links the order
// to their account. The backend stores the order and prices it itself.
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    items?: OrderLineInput[];
    customerName?: string;
    tableNumber?: string;
    notes?: string;
  } | null;

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "Pesanan tidak boleh kosong." },
      { status: 400 }
    );
  }

  // Only forward fields the backend accepts (it rejects unknown ones).
  const payload = {
    customerName: body.customerName?.trim() || undefined,
    tableNumber: body.tableNumber?.trim() || undefined,
    notes: body.notes?.trim() || undefined,
    items: body.items.map((item) => ({
      menuId: item.menuId,
      quantity: item.quantity,
      notes: item.notes?.trim() || undefined,
    })),
  };

  const token = await getUserToken(request);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(new URL("/orders", BACKEND_URL), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = Array.isArray(data.message) ? data.message[0] : data.message;
      return NextResponse.json(
        { error: message || "Gagal mengirim pesanan." },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil diterima!",
      order: data,
    });
  } catch (err) {
    console.error("[api/orders] Failed to reach backend:", err);
    return NextResponse.json(
      { error: "Gagal menghubungi server. Coba lagi nanti." },
      { status: 502 }
    );
  }
}
