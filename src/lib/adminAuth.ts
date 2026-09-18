import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const ADMIN_SESSION_COOKIE = "saluna_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours, matches backend JWT expiry

// The cookie holds the raw JWT issued by saluna-backend's POST /auth/login.
// This secret must be the SAME value as saluna-backend's JWT_SECRET, since
// the backend signs the token and this file only verifies it.
function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}

export async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

// Returns the raw JWT so proxy routes can forward it to the backend as
// `Authorization: Bearer <token>` — returns null if missing/invalid.
export async function getAdminToken(
  request: NextRequest
): Promise<string | null> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) return null;
  return token ?? null;
}
