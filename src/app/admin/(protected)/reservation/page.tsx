"use client";

import { useEffect, useState } from "react";
import type { Reservation, ReservationStatus } from "../../../../types";

const STATUS_TABS: { label: string; value: ReservationStatus | "ALL" }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-green-50 text-green-700",
  COMPLETED: "bg-blue-50 text-blue-700",
  CANCELLED: "bg-red-50 text-red-700",
};

function StatusBadge({ status }: { status: ReservationStatus }) {
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

export default function AdminReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ReservationStatus | "ALL">("ALL");
  const [busyId, setBusyId] = useState<number | null>(null);

  async function loadReservations() {
    setLoading(true);
    setError(null);
    try {
      const url =
        activeTab === "ALL"
          ? "/api/admin/reservation"
          : `/api/admin/reservation?status=${activeTab}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal memuat data reservasi.");
      const data = (await res.json()) as Reservation[];
      setReservations(data);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data reservasi. Pastikan server backend menyala.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function updateStatus(id: number, status: ReservationStatus) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/reservation/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Gagal mengubah status.");
      await loadReservations();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gagal mengubah status.");
    } finally {
      setBusyId(null);
    }
  }

  async function cancelReservation(id: number) {
    if (!confirm("Batalkan reservasi ini?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/reservation/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal membatalkan reservasi.");
      await loadReservations();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gagal membatalkan reservasi.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold text-navy">Reservation</h1>
        <p className="text-sm text-navy/60 font-sans mt-1">
          Kelola reservasi meja yang masuk dari pelanggan.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-sans transition ${
              activeTab === tab.value
                ? "bg-navy text-white"
                : "text-navy/60 border border-navy/10 hover:bg-navy/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6">
        {loading && <p className="text-sm text-navy/60 font-sans py-10 text-center">Memuat...</p>}
        {error && <p className="text-sm text-red-500 font-sans py-10 text-center">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="text-left text-navy/40 text-xs uppercase tracking-wide">
                  <th className="pb-3 pr-4 font-medium">Nama</th>
                  <th className="pb-3 pr-4 font-medium">Kontak</th>
                  <th className="pb-3 pr-4 font-medium">Tanggal &amp; Waktu</th>
                  <th className="pb-3 pr-4 font-medium">Pax</th>
                  <th className="pb-3 pr-4 font-medium">Catatan</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-t border-navy/5 text-navy align-top">
                    <td className="py-3 pr-4">{r.customerName}</td>
                    <td className="py-3 pr-4 text-navy/70">
                      <div>{r.email}</div>
                      <div className="text-xs text-navy/50">{r.phone}</div>
                    </td>
                    <td className="py-3 pr-4 text-navy/70">{formatDateTime(r.date)}</td>
                    <td className="py-3 pr-4 text-navy/70">{r.partySize}</td>
                    <td className="py-3 pr-4 text-navy/70">{r.notes || "-"}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3 text-xs">
                        {r.status === "PENDING" && (
                          <button
                            onClick={() => updateStatus(r.id, "CONFIRMED")}
                            disabled={busyId === r.id}
                            className="text-green-600 hover:text-green-700 underline disabled:opacity-50"
                          >
                            Confirm
                          </button>
                        )}
                        {r.status === "CONFIRMED" && (
                          <button
                            onClick={() => updateStatus(r.id, "COMPLETED")}
                            disabled={busyId === r.id}
                            className="text-blue-600 hover:text-blue-700 underline disabled:opacity-50"
                          >
                            Complete
                          </button>
                        )}
                        {(r.status === "PENDING" || r.status === "CONFIRMED") && (
                          <button
                            onClick={() => cancelReservation(r.id)}
                            disabled={busyId === r.id}
                            className="text-red-500 hover:text-red-600 underline disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                        {(r.status === "CANCELLED" || r.status === "COMPLETED") && (
                          <span className="text-navy/30">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-navy/50">
                      Belum ada reservasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
