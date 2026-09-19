import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Lets client components (Navbar, reservation form) learn who is logged in,
// since the session cookie is httpOnly and not readable from the browser.
export async function GET(request: NextRequest) {
  const user = await getSession(request);
  return NextResponse.json(
    { user },
    { headers: { "Cache-Control": "no-store" } }
  );
}
