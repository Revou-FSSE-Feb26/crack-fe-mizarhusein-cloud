"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "../types";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Event", href: "/event" },
  { label: "Promotion", href: "/promotion" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  // The navbar lives in the shared layout and is not remounted between pages,
  // so re-check the session after every navigation (covers login/logout).
  useEffect(() => {
    let cancelled = false;

    function loadSession() {
      fetch("/api/auth/me", { cache: "no-store" })
        .then((res) => res.json())
        .then((data: { user: SessionUser | null }) => {
          if (!cancelled) setUser(data.user);
        })
        .catch(() => {
          if (!cancelled) setUser(null);
        });
    }

    loadSession();
    // The profile page fires this after the name changes.
    window.addEventListener("saluna:session-changed", loadSession);
    return () => {
      cancelled = true;
      window.removeEventListener("saluna:session-changed", loadSession);
    };
  }, [pathname]);

  async function handleLogout() {
    setMobileOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const firstName = user ? (user.name?.trim().split(" ")[0] ?? user.email) : "";

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex justify-between items-center">
        <Link href="/" className="text-navy leading-none" onClick={() => setMobileOpen(false)}>
          <span className="block font-script text-4xl">Saluna</span>
          <span className="block text-[11px] tracking-[4px] font-sans -mt-1 ml-1">
            BEACH CLUB
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 text-sm uppercase tracking-[2px] font-sans text-navy">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:opacity-60 transition">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6 font-sans text-xs uppercase tracking-[2px] text-navy">
          {user ? (
            <>
              <Link
                href={user.role === "ADMIN" ? "/admin/dashboard" : "/my-reservations"}
                className="hover:opacity-60 transition"
              >
                {user.role === "ADMIN" ? "Admin" : `Hi, ${firstName}`}
              </Link>
              <button onClick={handleLogout} className="hover:opacity-60 transition uppercase">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:opacity-60 transition">
              Login
            </Link>
          )}
          <Link
            href="/reservation"
            className="inline-block bg-navy text-white rounded-full px-8 py-3 hover:bg-navy-dark transition"
          >
            Reservation
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-3xl leading-none text-navy"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-cream border-t border-navy/10 px-6 py-6">
          <div className="flex flex-col gap-5 uppercase tracking-[2px] text-sm font-sans text-navy">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-left hover:opacity-60 transition"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={user.role === "ADMIN" ? "/admin/dashboard" : "/my-reservations"}
                  className="text-left hover:opacity-60 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  {user.role === "ADMIN" ? "Admin" : "Reservasi Saya"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left uppercase hover:opacity-60 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-left hover:opacity-60 transition"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
            <Link
              href="/reservation"
              onClick={() => setMobileOpen(false)}
              className="inline-block bg-navy text-white rounded-full px-8 py-3 text-center text-xs uppercase tracking-[2px]"
            >
              Reservation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
