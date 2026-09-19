"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconBell,
  IconCalendar,
  IconClipboard,
  IconClock,
  IconUsers,
} from "../../../../components/admin/icons";
import { formatRupiah } from "../../../../lib/format";
import type {
  DashboardStats,
  OrderStatus,
  ReservationStatus,
  SessionUser,
} from "../../../../types";

const STATUS_STYLES: Record<ReservationStatus | OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-green-50 text-green-700",
  PREPARING: "bg-blue-50 text-blue-700",
  SERVED: "bg-purple-50 text-purple-700",
  COMPLETED: "bg-blue-50 text-blue-700",
  CANCELLED: "bg-red-50 text-red-700",
};

function StatusBadge({ status }: { status: ReservationStatus | OrderStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-sans font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

interface Card {
  label: string;
  value: string;
  hint: string;
  href?: string;
  icon: typeof IconCalendar;
  bg: string;
  fg: string;
}

function buildCards(stats: DashboardStats): { reservations: Card[]; orders: Card[] } {
  return {
    reservations: [
      {
        label: "Today's Reservations",
        value: String(stats.todayReservations),
        hint: "View details",
        href: "/admin/reservation",
        icon: IconCalendar,
        bg: "bg-blue-50",
        fg: "text-blue-600",
      },
      {
        label: "Total Guests",
        value: String(stats.todayGuests),
        hint: "Today",
        icon: IconUsers,
        bg: "bg-green-50",
        fg: "text-green-600",
      },
      {
        label: "Upcoming Reservations",
        value: String(stats.upcomingReservations),
        hint: "Next 7 days",
        icon: IconClock,
        bg: "bg-amber-50",
        fg: "text-amber-600",
      },
      {
        label: "Total Menu Items",
        value: String(stats.totalMenuItems),
        hint: "View menu",
        href: "/admin/menu",
        icon: IconClipboard,
        bg: "bg-purple-50",
        fg: "text-purple-600",
      },
    ],
    orders: [
      {
        label: "Orders Today",
        value: String(stats.ordersToday),
        hint: "Excluding cancelled",
        href: "/admin/orders",
        icon: IconClipboard,
        bg: "bg-blue-50",
        fg: "text-blue-600",
      },
      {
        label: "Revenue Today",
        value: formatRupiah(stats.revenueToday),
        hint: "Incl. tax, excl. cancelled",
        icon: IconClipboard,
        bg: "bg-green-50",
        fg: "text-green-600",
      },
      {
        label: "Active Orders",
        value: String(stats.activeOrders),
        hint: "Pending or preparing",
        href: "/admin/orders",
        icon: IconClock,
        bg: "bg-amber-50",
        fg: "text-amber-600",
      },
      {
        label: "Pending Reservations",
        value: String(stats.pendingReservations),
        hint: "Waiting for confirmation",
        href: "/admin/reservation",
        icon: IconCalendar,
        bg: "bg-purple-50",
        fg: "text-purple-600",
      },
    ],
  };
}

function StatCard({ card }: { card: Card }) {
  const { label, value, hint, href, icon: Icon, bg, fg } = card;
  const body = (
    <div className={`rounded-2xl p-5 h-full ${bg}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${fg} bg-white/60 mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm font-sans text-navy/60 mb-1">{label}</p>
      <p className="text-2xl font-serif font-semibold text-navy mb-1">{value}</p>
      <p className={`text-xs font-sans ${fg}`}>{hint}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="block hover:opacity-90 transition">
      {body}
    </Link>
  ) : (
    body
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { user: SessionUser | null }) => {
        if (data.user?.name) setAdminName(data.user.name);
      })
      .catch(() => {});
  }, []);

  // Load now, then refresh every 30s so new bookings and orders show up on their own.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = (await res.json()) as DashboardStats;
        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Gagal memuat data dashboard. Pastikan server backend menyala.");
      }
    }

    load();
    const timer = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const cards = stats ? buildCards(stats) : null;
  const attention = stats ? stats.pendingReservations + stats.activeOrders : 0;

  return (
    <main className="px-8 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy">
            Welcome back, {adminName}!
          </h1>
          <p className="text-sm text-navy/60 font-sans mt-1">
            Here&apos;s what&apos;s happening with Saluna Beach Club today.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative" title="Pending reservations + active orders">
            <IconBell className="w-5 h-5 text-navy/70" />
            {attention > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] leading-none rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {attention}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy font-sans font-semibold text-xs">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-sans text-navy">{adminName}</span>
          </div>
        </div>
      </div>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-sans text-red-700">{error}</p>
      )}

      {!stats && !error && <p className="text-sm font-sans text-navy/60">Memuat...</p>}

      {stats && cards && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            {cards.reservations.map((card) => (
              <StatCard key={card.label} card={card} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {cards.orders.map((card) => (
              <StatCard key={card.label} card={card} />
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-semibold text-navy">Recent Reservations</h2>
              <Link
                href="/admin/reservation"
                className="text-sm font-sans text-navy/70 hover:text-navy transition"
              >
                View All Reservations →
              </Link>
            </div>

            {stats.recentReservations.length === 0 ? (
              <p className="text-sm font-sans text-navy/50">Belum ada reservasi.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr className="text-left text-navy/40 text-xs uppercase tracking-wide">
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium">Date</th>
                      <th className="pb-3 pr-4 font-medium">Time</th>
                      <th className="pb-3 pr-4 font-medium">Pax</th>
                      <th className="pb-3 pr-4 font-medium">Contact</th>
                      <th className="pb-3 pr-4 font-medium">Request / Notes</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentReservations.map((r) => (
                      <tr key={r.id} className="border-t border-navy/5 text-navy">
                        <td className="py-3 pr-4">{r.customerName}</td>
                        <td className="py-3 pr-4 text-navy/70">{formatDate(r.date)}</td>
                        <td className="py-3 pr-4 text-navy/70">{formatTime(r.date)}</td>
                        <td className="py-3 pr-4 text-navy/70">{r.partySize}</td>
                        <td className="py-3 pr-4 text-navy/70">{r.phone}</td>
                        <td className="py-3 pr-4 text-navy/70">{r.notes || "-"}</td>
                        <td className="py-3">
                          <StatusBadge status={r.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-semibold text-navy">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-sm font-sans text-navy/70 hover:text-navy transition"
              >
                View All Orders →
              </Link>
            </div>

            {stats.recentOrders.length === 0 ? (
              <p className="text-sm font-sans text-navy/50">Belum ada pesanan.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr className="text-left text-navy/40 text-xs uppercase tracking-wide">
                      <th className="pb-3 pr-4 font-medium">Order</th>
                      <th className="pb-3 pr-4 font-medium">Guest / Table</th>
                      <th className="pb-3 pr-4 font-medium">Items</th>
                      <th className="pb-3 pr-4 font-medium">Total</th>
                      <th className="pb-3 pr-4 font-medium">Placed</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((o) => (
                      <tr key={o.id} className="border-t border-navy/5 text-navy">
                        <td className="py-3 pr-4">#{o.id}</td>
                        <td className="py-3 pr-4 text-navy/70">
                          {[o.customerName, o.tableNumber && `Meja ${o.tableNumber}`]
                            .filter(Boolean)
                            .join(" · ") || "-"}
                        </td>
                        <td className="py-3 pr-4 text-navy/70">
                          {o.items.reduce((n, i) => n + i.quantity, 0)} item
                        </td>
                        <td className="py-3 pr-4 text-navy/70">{formatRupiah(o.total)}</td>
                        <td className="py-3 pr-4 text-navy/70">
                          {formatDate(o.createdAt)} {formatTime(o.createdAt)}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={o.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
