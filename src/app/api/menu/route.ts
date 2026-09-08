import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const url = new URL("/menus", BACKEND_URL);
  if (category) url.searchParams.set("category", category);

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Backend responded ${res.status}`);
    const items = await res.json();
    return NextResponse.json(items);
  } catch (err) {
    console.error("[api/menu] Failed to reach backend:", err);
    return NextResponse.json(
      { error: "Gagal memuat menu dari server." },
      { status: 502 }
    );
  }
}
