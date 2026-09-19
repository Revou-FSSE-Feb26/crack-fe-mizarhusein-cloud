"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { safeNextPath } from "../../lib/redirect";

type Mode = "login" | "register";

const INPUT_CLASS =
  "w-full rounded-lg border border-navy/20 px-4 py-3 text-navy outline-none placeholder:text-navy/40 focus:border-navy";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Keep the destination when switching between the login and register pages.
  const otherHref = `${isRegister ? "/login" : "/register"}${
    next ? `?next=${encodeURIComponent(next)}` : ""
  }`;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isRegister ? { name, email, password } : { email, password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? (isRegister ? "Pendaftaran gagal." : "Login gagal."));
        setLoading(false);
        return;
      }

      router.push(safeNextPath(next));
      router.refresh();
    } catch {
      setError("Gagal menghubungi server. Coba lagi nanti.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-6 pb-20 pt-36">
      <section className="mx-auto max-w-md">
        <p className="text-center text-xs uppercase tracking-[3px] text-navy/60">
          Saluna Beach Club
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl text-navy">
          {isRegister ? "Buat Akun" : "Masuk"}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-6 text-navy/70">
          {isRegister
            ? "Daftar dalam hitungan detik untuk mulai membuat reservasi. Tanpa verifikasi email."
            : "Masuk untuk membuat dan melihat reservasi kamu."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm md:p-8"
        >
          {isRegister && (
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-navy">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Nama kamu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-navy">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-navy">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={isRegister ? 6 : undefined}
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder={isRegister ? "Minimal 6 karakter" : "Password kamu"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-navy px-6 py-4 text-xs uppercase tracking-[2px] text-white transition hover:bg-navy-dark disabled:opacity-60"
          >
            {loading ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}
          </button>

          <p className="text-center text-sm text-navy/70">
            {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
            <Link href={otherHref} className="font-medium text-navy underline">
              {isRegister ? "Masuk" : "Daftar sekarang"}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
