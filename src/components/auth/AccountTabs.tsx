"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Reservasi", href: "/my-reservations" },
  { label: "Pesanan", href: "/my-orders" },
  { label: "Profil", href: "/profile" },
];

// Navigation between the customer's account pages.
export default function AccountTabs() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex justify-center gap-2">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`rounded-full px-5 py-2 text-xs uppercase tracking-[2px] transition ${
            pathname === tab.href
              ? "bg-navy text-white"
              : "bg-white text-navy/70 hover:bg-navy/5"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
