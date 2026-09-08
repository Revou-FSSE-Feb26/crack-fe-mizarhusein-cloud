"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Event", href: "/event" },
  { label: "Promotion", href: "/promotion" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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

        <Link
          href="/reservation"
          className="hidden md:inline-block bg-navy text-white rounded-full px-8 py-3 text-xs uppercase tracking-[2px] font-sans hover:bg-navy-dark transition"
        >
          Reservation
        </Link>

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
