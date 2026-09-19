import { NextRequest, NextResponse } from "next/server";
import { readSession, setSessionCookie } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

// Public sign-up: creates a CUSTOMER account and logs the user straight in
// (no email verification), so they can continue to the reservation page.
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
  } | null;

  const name = body?.name?.trim();
  const email = body?.email?.trim();
  const password = body?.password;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Nama, email, dan password wajib diisi." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password minimal 6 karakter." },
      { status: 400 }
    );
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(new URL("/auth/register", BACKEND_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      cache: "no-store",
    });
  } catch (err) {
    console.error("[api/auth/register] backend unreachable:", err);
    return NextResponse.json(
      { error: "Gagal menghubungi server. Coba lagi nanti." },
      { status: 502 }
    );
  }

  if (backendRes.status === 409) {
    return NextResponse.json(
      { error: "Email sudah terdaftar. Silakan login." },
      { status: 409 }
    );
  }
  if (!backendRes.ok) {
    const data = await backendRes.json().catch(() => ({}));
    const message = Array.isArray(data.message) ? data.message[0] : data.message;
    return NextResponse.json(
      { error: message || "Pendaftaran gagal. Coba lagi." },
      { status: backendRes.status === 400 ? 400 : 502 }
    );
  }

  const data = (await backendRes.json()) as { access_token: string };
  const session = await readSession(data.access_token);

  const response = NextResponse.json({ user: session });
  setSessionCookie(response, data.access_token);
  return response;
}
