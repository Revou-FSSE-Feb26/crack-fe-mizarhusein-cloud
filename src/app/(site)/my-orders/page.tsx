"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AccountTabs from "../../../components/auth/AccountTabs";
import { formatRupiah } from "../../../lib/format";
import type { Order, OrderStatus } from "../../../types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Menunggu",
  PREPARING: "Sedang Disiapkan",
  SERVED: "Sudah Disajikan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PREPARING: "bg-blue-100 text-blue-800",
  SERVED: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-700",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  // Load now and refresh every 20 s so the status follows what the kitchen does.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/orders/me", { cache: "no-store" });
        if (res.status === 401) {
          router.replace("/login?next=/my-orders");
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Gagal memuat pesanan.");
          return;
        }
        setError("");
        setOrders(data as Order[]);
      } catch {
        if (!cancelled) setError("Gagal menghubungi server. Coba lagi nanti.");
      }
    }

    load();
    const timer = setInterval(load, 20_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-cream px-6 pb-20 pt-36">
      <section className="mx-auto max-w-2xl">
        <p className="text-center text-xs uppercase tracking-[3px] text-navy/60">
          Saluna Beach Club
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl text-navy md:text-5xl">
          Pesanan Saya
        </h1>
        <AccountTabs />

        {error && <p className="mt-8 text-center text-sm text-red-500">{error}</p>}

        {orders === null && !error && (
          <p className="mt-10 text-center text-sm text-navy/60">Memuat...</p>
        )}

        {orders?.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-navy/70">
              Belum ada pesanan. Pesanan yang kamu buat dari menu saat sudah login akan muncul di sini.
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-block rounded-full bg-navy px-6 py-3 text-xs uppercase tracking-[2px] text-white transition hover:bg-navy-dark"
            >
              Lihat Menu
            </Link>
          </div>
        )}

        {orders && orders.length > 0 && (
          <ul className="mt-10 flex flex-col gap-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg text-navy">
                      Pesanan #{order.id}
                      {order.tableNumber && (
                        <span className="font-sans text-sm text-navy/60"> · Meja {order.tableNumber}</span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-navy/50">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[order.status]}`}
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>

                <ul className="mt-4 divide-y divide-navy/5 text-sm text-navy">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3 py-2">
                      <span>
                        <span className="text-navy/60">{item.quantity}× </span>
                        {item.name}
                        {item.notes && (
                          <span className="block text-xs italic text-navy/50">&quot;{item.notes}&quot;</span>
                        )}
                      </span>
                      <span className="shrink-0 text-navy/70">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-3 border-t border-navy/10 pt-3 text-right text-sm text-navy">
                  Total (termasuk pajak): <span className="font-semibold">{formatRupiah(order.total)}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
