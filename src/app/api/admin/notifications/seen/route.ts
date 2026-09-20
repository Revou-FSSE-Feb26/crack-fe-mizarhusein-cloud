import { NextRequest, NextResponse } from "next/server";
import { getAdminToken } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

// The admin opened the bell: everything so far counts as seen.
export async function POST(request: NextRequest) {
  const token = await getAdminToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(new URL("/admin/notifications/seen", BACKEND_URL), {
      method: "POST",
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/admin/notifications/seen] POST failed:", err);
    return NextResponse.json({ error: "Gagal menghubungi server." }, { status: 502 });
  }
}
