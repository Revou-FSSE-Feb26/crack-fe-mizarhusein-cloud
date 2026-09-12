"use client";

import { FormEvent, useMemo, useState } from "react";
import type { FormStatus } from "../../../types";

export default function ReservationPage() {
  const [pax, setPax] = useState("");
  const [customPax, setCustomPax] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    return {
      minDate: formatDate(today),
      maxDate: formatDate(threeMonthsLater),
    };
  }, []);

  // 16:00 up to 22:30.
  // 23:00 is excluded because the restaurant is closed for orders.
  const timeSlots = useMemo(() => {
    const slots: string[] = [];

    for (let minutes = 16 * 60; minutes < 23 * 60; minutes += 30) {
      const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
      const minute = String(minutes % 60).padStart(2, "0");
      slots.push(`${hour}:${minute}`);
    }

    return slots;
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const title = form.get("title") as string;
    const fullName = (form.get("fullName") as string).trim();
    const email = (form.get("email") as string).trim();
    const phone = (form.get("phone") as string).trim();
    const date = form.get("date") as string;
    const time = form.get("time") as string;
    const partySize = Number(pax === "custom" ? customPax : pax);

    const payload = {
      customerName: `${title} ${fullName}`.trim(),
      email,
      phone,
      partySize,
      date: new Date(`${date}T${time}:00`).toISOString(),
    };

    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal membuat reservasi. Coba lagi.");
        setStatus("error");
        return;
      }

      setStatus("success");
      formEl.reset();
      setPax("");
      setCustomPax("");
    } catch (err) {
      console.error(err);
      setErrorMessage("Gagal menghubungi server. Coba lagi nanti.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-cream px-6 pb-20 pt-36">
      <section className="mx-auto max-w-2xl">
        <p className="text-center text-xs uppercase tracking-[3px] text-navy/60">
          Saluna Beach Club
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl text-navy md:text-5xl">
          Make a Reservation
        </h1>
        <p className="mx-auto mt-4 max-w-md text-center text-sm leading-6 text-navy/70">
          Reserve your table and enjoy an unforgettable evening with us.
        </p>

        {status === "success" ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="font-serif text-2xl text-navy">Reservasi Terkirim!</h2>
            <p className="mt-3 text-sm text-navy/70">
              Terima kasih, reservasi kamu sudah kami terima. Tim kami akan
              menghubungi untuk konfirmasi.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-full bg-navy px-6 py-3 text-xs uppercase tracking-[2px] text-white hover:bg-navy-dark transition"
            >
              Buat Reservasi Lain
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-2xl bg-white p-6 shadow-sm md:p-10"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-navy"
                >
                  Title
                </label>
                <select
                  id="title"
                  name="title"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-navy/20 bg-white px-4 py-3 text-navy outline-none focus:border-navy"
                >
                  <option value="" disabled>
                    Select a title
                  </option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Miss">Miss</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-navy"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-lg border border-navy/20 px-4 py-3 text-navy outline-none placeholder:text-navy/40 focus:border-navy"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-navy"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-navy/20 px-4 py-3 text-navy outline-none placeholder:text-navy/40 focus:border-navy"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-navy"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  required
                  className="w-full rounded-lg border border-navy/20 px-4 py-3 text-navy outline-none placeholder:text-navy/40 focus:border-navy"
                />
              </div>

              <div>
                <label
                  htmlFor="pax"
                  className="mb-2 block text-sm font-medium text-navy"
                >
                  Number of Guests
                </label>
                <select
                  id="pax"
                  name="pax"
                  value={pax}
                  onChange={(event) => setPax(event.target.value)}
                  required
                  className="w-full rounded-lg border border-navy/20 bg-white px-4 py-3 text-navy outline-none focus:border-navy"
                >
                  <option value="" disabled>
                    Select number of guests
                  </option>
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="custom">Other</option>
                </select>
              </div>

              {pax === "custom" && (
                <div>
                  <label
                    htmlFor="customPax"
                    className="mb-2 block text-sm font-medium text-navy"
                  >
                    Number of Guests
                  </label>
                  <input
                    id="customPax"
                    name="customPax"
                    type="number"
                    min="1"
                    placeholder="Enter number of guests"
                    value={customPax}
                    onChange={(event) => setCustomPax(event.target.value)}
                    required
                    className="w-full rounded-lg border border-navy/20 px-4 py-3 text-navy outline-none placeholder:text-navy/40 focus:border-navy"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-navy"
                >
                  Reservation Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  min={minDate}
                  max={maxDate}
                  required
                  className="w-full rounded-lg border border-navy/20 bg-white px-4 py-3 text-navy outline-none focus:border-navy"
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block text-sm font-medium text-navy"
                >
                  Reservation Time
                </label>
                <select
                  id="time"
                  name="time"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-navy/20 bg-white px-4 py-3 text-navy outline-none focus:border-navy"
                >
                  <option value="" disabled>
                    Select a time
                  </option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-navy/60">
                  Last reservation slot: 22:30. Orders close at 23:00.
                </p>
              </div>
            </div>

            {status === "error" && (
              <p className="mt-6 text-center text-sm text-red-500">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-8 w-full rounded-full bg-navy px-6 py-4 text-xs uppercase tracking-[2px] text-white transition hover:bg-navy-dark disabled:opacity-60"
            >
              {status === "loading" ? "Mengirim..." : "Confirm Reservation"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
