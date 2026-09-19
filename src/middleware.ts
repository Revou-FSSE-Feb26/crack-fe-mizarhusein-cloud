import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);

  // Admin area: must be logged in AND have the ADMIN role.
  if (pathname.startsWith("/admin")) {
    if (session?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // Customer pages (booking, my reservations): any logged-in user.
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/reservation/:path*",
    "/admin/menu/:path*",
    "/admin/orders/:path*",
    "/admin/settings/:path*",
    "/reservation/:path*",
    "/my-reservations/:path*",
  ],
};
