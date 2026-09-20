import { NextRequest, NextResponse } from "next/server";
import { getUserToken, setSessionCookie } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

function firstMessage(data: { message?: string | string[] }) {
  return Array.isArray(data.message) ? data.message[0] : data.message;
}

// The logged-in user's own profile.
export async function GET(request: NextRequest) {
  const token = await getUserToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(new URL("/users/me", BACKEND_URL), {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/users/me] GET failed:", err);
    return NextResponse.json({ error: "Gagal menghubungi server." }, { status: 502 });
  }
}

// Change the name and/or the password. The backend answers with a fresh token
// (the name is stored inside it), which replaces the session cookie.
export async function PATCH(request: NextRequest) {
  const token = await getUserToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
  } | null;
  if (!body) {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  // Only forward the fields the backend accepts; drop empty strings.
  const payload = {
    name: body.name?.trim() || undefined,
    currentPassword: body.currentPassword || undefined,
    newPassword: body.newPassword || undefined,
  };

  try {
    const res = await fetch(new URL("/users/me", BACKEND_URL), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: firstMessage(data) || "Gagal menyimpan profil." },
        { status: res.status }
      );
    }

    const response = NextResponse.json({ user: data.user });
    if (data.access_token) setSessionCookie(response, data.access_token);
    return response;
  } catch (err) {
    console.error("[api/users/me] PATCH failed:", err);
    return NextResponse.json({ error: "Gagal menghubungi server." }, { status: 502 });
  }
}
