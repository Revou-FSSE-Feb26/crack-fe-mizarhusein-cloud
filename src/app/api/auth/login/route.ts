import { NextRequest, NextResponse } from "next/server";
import { readSession, setSessionCookie } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

// Login for any role (customers and admins). The admin dashboard has its own
// stricter form at /admin/login.
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };
  const email = body.email?.trim();
  const { password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 }
    );
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(new URL("/auth/login", BACKEND_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch (err) {
    console.error("[api/auth/login] backend unreachable:", err);
    return NextResponse.json(
      { error: "Gagal menghubungi server. Coba lagi nanti." },
      { status: 502 }
    );
  }

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 }
    );
  }

  const data = (await backendRes.json()) as { access_token: string };
  const session = await readSession(data.access_token);

  const response = NextResponse.json({ user: session });
  setSessionCookie(response, data.access_token);
  return response;
}
