import type { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const SESSION_COOKIE = "saluna_session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours, matches backend JWT expiry

export type Role = "ADMIN" | "CUSTOMER";

export interface Session {
  userId: number;
  email: string;
  name: string | null;
  role: Role;
}

// The cookie holds the raw JWT issued by saluna-backend's POST /auth/login or
// /auth/register. This secret must be the SAME value as saluna-backend's
// JWT_SECRET, since the backend signs the token and this file only verifies it.
function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

// Verifies a JWT and returns who it belongs to, or null if missing/invalid/expired.
export async function readSession(
  token: string | undefined | null
): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const { sub, email, name, role } = payload as {
      sub?: string;
      email?: string;
      name?: string | null;
      role?: string;
    };
    if (!sub || !email || (role !== "ADMIN" && role !== "CUSTOMER")) return null;
    return { userId: Number(sub), email, name: name ?? null, role };
  } catch {
    return null;
  }
}

export async function getSession(request: NextRequest): Promise<Session | null> {
  return readSession(request.cookies.get(SESSION_COOKIE)?.value);
}

// Returns the raw JWT so proxy routes can forward it to the backend as
// `Authorization: Bearer <token>` — null unless the caller is logged in.
export async function getUserToken(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return (await readSession(token)) ? (token ?? null) : null;
}

// Same as getUserToken, but only for admins.
export async function getAdminToken(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await readSession(token);
  return session?.role === "ADMIN" ? (token ?? null) : null;
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}
