"use client";

import { useEffect, useState } from "react";
import { formatRupiah } from "../../../../lib/format";
import type { Order, OrderStatus } from "../../../../types";

const STATUS_TABS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Served", value: "SERVED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PREPARING: "bg-blue-50 text-blue-700",
  SERVED: "bg-purple-50 text-purple-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

// The next step in the normal flow of an order, and the button label for it.
const NEXT_STEP: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  PENDING: { status: "PREPARING", label: "Mulai Siapkan" },
  PREPARING: { status: "SERVED", label: "Tandai Disajikan" },
  SERVED: { status: "COMPLETED", label: "Selesai" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-sans font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus | "ALL">("ALL");
  const [busyId, setBusyId] = useState<number | null>(null);

  async function loadOrders(showSpinner: boolean) {
    if (showSpinner) setLoading(true);
    setError(null);
    try {
      const url =
        activeTab === "ALL" ? "/api/admin/orders" : `/api/admin/orders?status=${activeTab}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat pesanan.");
      setOrders((await res.json()) as Order[]);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data pesanan. Pastikan server backend menyala.");
    } finally {
      setLoading(false);
    }
  }

  // Reload when the tab changes, and poll so new orders appear without a refresh.
  useEffect(() => {
    loadOrders(true);
    const timer = setInterval(() => loadOrders(false), 20_000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function updateStatus(id: number, status: OrderStatus) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Gagal mengubah status.");
      }
      await loadOrders(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengubah status.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="px-8 py-8">
      <h1 className="font-serif text-2xl font-semibold text-navy">Orders</h1>
      <p className="text-sm text-navy/60 font-sans mt-1 mb-6">
        Pesanan dari menu digital. Ubah status seiring pesanan diproses.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-sans transition ${
              activeTab === tab.value
                ? "bg-navy text-white"
                : "bg-white text-navy/70 hover:bg-navy/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-sans text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="text-sm font-sans text-navy/60">Memuat...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-sm font-sans text-navy/50">
          Belum ada pesanan{activeTab === "ALL" ? "" : ` dengan status ${activeTab}`}.
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => {
            const next = NEXT_STEP[order.status];
            const canCancel = order.status !== "COMPLETED" && order.status !== "CANCELLED";
            return (
              <li key={order.id} className="bg-white rounded-2xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg text-navy">
                      Order #{order.id}
                      {order.tableNumber && (
                        <span className="text-navy/60 font-sans text-sm"> · Meja {order.tableNumber}</span>
                      )}
                    </p>
                    <p className="text-xs font-sans text-navy/50 mt-0.5">
                      {formatDateTime(order.createdAt)}
                      {order.customerName && ` · ${order.customerName}`}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <table className="w-full text-sm font-sans mt-4">
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-t border-navy/5 text-navy">
                        <td className="py-2 pr-3 w-10 text-navy/60">{item.quantity}×</td>
                        <td className="py-2 pr-3">
                          {item.name}
                          {item.notes && (
                            <span className="block text-xs italic text-navy/50">
                              &quot;{item.notes}&quot;
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-right text-navy/70">
                          {formatRupiah(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {order.notes && (
                  <p className="text-xs font-sans text-navy/60 mt-3">Catatan: {order.notes}</p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 pt-4">
                  <div className="text-sm font-sans text-navy/70">
                    Subtotal {formatRupiah(order.subtotal)} · Pajak {formatRupiah(order.tax)} ·{" "}
                    <span className="font-semibold text-navy">Total {formatRupiah(order.total)}</span>
                  </div>
                  <div className="flex gap-2">
                    {canCancel && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Batalkan order #${order.id}?`)) {
                            updateStatus(order.id, "CANCELLED");
                          }
                        }}
                        disabled={busyId === order.id}
                        className="px-4 py-1.5 rounded-full border border-red-200 text-red-600 text-sm font-sans hover:bg-red-50 transition disabled:opacity-60"
                      >
                        Batalkan
                      </button>
                    )}
                    {next && (
                      <button
                        onClick={() => updateStatus(order.id, next.status)}
                        disabled={busyId === order.id}
                        className="px-4 py-1.5 rounded-full bg-navy text-white text-sm font-sans hover:bg-navy-dark transition disabled:opacity-60"
                      >
                        {busyId === order.id ? "..." : next.label}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
