import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    customerName?: string;
    email?: string;
    phone?: string;
    partySize?: number;
    date?: string;
    notes?: string;
  } | null;

  if (
    !body ||
    !body.customerName?.trim() ||
    !body.email?.trim() ||
    !body.phone?.trim() ||
    !body.partySize ||
    !body.date
  ) {
    return NextResponse.json(
      { error: "Semua field wajib harus diisi." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(new URL("/reservations", BACKEND_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || data.error || "Gagal membuat reservasi." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[api/reservation] Failed to reach backend:", err);
    return NextResponse.json(
      { error: "Gagal menghubungi server. Coba lagi nanti." },
      { status: 502 }
    );
  }
}
