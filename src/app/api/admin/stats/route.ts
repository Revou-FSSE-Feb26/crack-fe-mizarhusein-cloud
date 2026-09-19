import { NextRequest, NextResponse } from "next/server";
import { getAdminToken } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

// Numbers and recent activity for the admin dashboard.
export async function GET(request: NextRequest) {
  const token = await getAdminToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(new URL("/admin/stats", BACKEND_URL), {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/admin/stats] GET failed:", err);
    return NextResponse.json({ error: "Gagal menghubungi server." }, { status: 502 });
  }
}
