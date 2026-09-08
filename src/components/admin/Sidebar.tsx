"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconCalendar,
  IconChevronDown,
  IconDashboard,
  IconLogout,
  IconMenu,
  IconSettings,
} from "./icons";

const MANAGEMENT_LINKS = [
  { label: "Reservation", href: "/admin/reservation", icon: IconCalendar },
  { label: "Menu", href: "/admin/menu", icon: IconMenu },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="w-64 shrink-0 min-h-screen bg-white border-r border-navy/10 flex flex-col px-5 py-6">
      <Link href="/admin/dashboard" className="px-2 mb-8 leading-none">
        <span className="block font-script text-3xl text-navy">Saluna</span>
        <span className="block text-[10px] tracking-[4px] font-sans text-navy/60 -mt-1 ml-0.5">
          BEACH CLUB
        </span>
      </Link>

      <div className="flex items-center gap-3 px-2 py-2.5 mb-6 rounded-xl">
        <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center text-navy font-sans font-semibold text-sm">
          A
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-sans font-medium text-navy leading-tight">Admin</p>
          <p className="text-xs font-sans text-navy/50 leading-tight">Administrator</p>
        </div>
        <IconChevronDown className="w-4 h-4 text-navy/40" />
      </div>

      <nav className="flex flex-col gap-1 font-sans text-sm">
        <Link
          href="/admin/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
            isActive("/admin/dashboard")
              ? "bg-navy/10 text-navy font-medium"
              : "text-navy/70 hover:bg-navy/5"
          }`}
        >
          <IconDashboard className="w-[18px] h-[18px]" />
          Dashboard
        </Link>

        <p className="mt-5 mb-1 px-3 text-[11px] tracking-[2px] text-navy/40 uppercase">
          Management
        </p>
        {MANAGEMENT_LINKS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
              isActive(href) ? "bg-navy/10 text-navy font-medium" : "text-navy/70 hover:bg-navy/5"
            }`}
          >
            <Icon className="w-[18px] h-[18px]" />
            {label}
          </Link>
        ))}

        <p className="mt-5 mb-1 px-3 text-[11px] tracking-[2px] text-navy/40 uppercase">Other</p>
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
            isActive("/admin/settings") ? "bg-navy/10 text-navy font-medium" : "text-navy/70 hover:bg-navy/5"
          }`}
        >
          <IconSettings className="w-[18px] h-[18px]" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-navy/70 hover:bg-navy/5 transition text-left"
        >
          <IconLogout className="w-[18px] h-[18px]" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
