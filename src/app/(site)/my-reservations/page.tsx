"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AccountTabs from "../../../components/auth/AccountTabs";
import type { Reservation, ReservationStatus } from "../../../types";

const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  CANCELLED: "Dibatalkan",
  COMPLETED: "Selesai",
};

const STATUS_STYLE: Record<ReservationStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-navy/10 text-navy",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MyReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/reservation/me", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/login?next=/my-reservations");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal memuat reservasi.");
        return;
      }
      setReservations(data as Reservation[]);
    } catch {
      setError("Gagal menghubungi server. Coba lagi nanti.");
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCancel(id: number) {
    if (!window.confirm("Batalkan reservasi ini?")) return;
    setCancellingId(id);
    setError("");
    try {
      const res = await fetch(`/api/reservation/me/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Gagal membatalkan reservasi.");
      } else {
        await load();
      }
    } catch {
      setError("Gagal menghubungi server. Coba lagi nanti.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-6 pb-20 pt-36">
      <section className="mx-auto max-w-2xl">
        <p className="text-center text-xs uppercase tracking-[3px] text-navy/60">
          Saluna Beach Club
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl text-navy md:text-5xl">
          Reservasi Saya
        </h1>
        <AccountTabs />

        {error && <p className="mt-8 text-center text-sm text-red-500">{error}</p>}

        {reservations === null && !error && (
          <p className="mt-10 text-center text-sm text-navy/60">Memuat...</p>
        )}

        {reservations?.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-navy/70">Kamu belum punya reservasi.</p>
            <Link
              href="/reservation"
              className="mt-6 inline-block rounded-full bg-navy px-6 py-3 text-xs uppercase tracking-[2px] text-white transition hover:bg-navy-dark"
            >
              Buat Reservasi
            </Link>
          </div>
        )}

        {reservations && reservations.length > 0 && (
          <>
            <ul className="mt-10 flex flex-col gap-4">
              {reservations.map((r) => {
                const cancellable = r.status === "PENDING" || r.status === "CONFIRMED";
                return (
                  <li key={r.id} className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg text-navy">{formatDateTime(r.date)}</p>
                        <p className="mt-1 text-sm text-navy/70">
                          {r.partySize} tamu · atas nama {r.customerName}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[r.status]}`}
                      >
                        {STATUS_LABEL[r.status]}
                      </span>
                    </div>

                    {r.notes && <p className="mt-3 text-sm text-navy/60">Catatan: {r.notes}</p>}

                    {cancellable && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        disabled={cancellingId === r.id}
                        className="mt-4 text-xs uppercase tracking-[2px] text-red-600 underline disabled:opacity-60"
                      >
                        {cancellingId === r.id ? "Membatalkan..." : "Batalkan"}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 text-center">
              <Link
                href="/reservation"
                className="inline-block rounded-full bg-navy px-6 py-3 text-xs uppercase tracking-[2px] text-white transition hover:bg-navy-dark"
              >
                Buat Reservasi Baru
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
