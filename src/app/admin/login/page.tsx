"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Login gagal.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-5"
      >
        <div className="text-center mb-2">
          <span className="block font-script text-4xl text-navy">Saluna</span>
          <span className="block text-xs tracking-[3px] text-navy/70 uppercase mt-1 font-sans">
            Admin Login
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm text-navy font-medium font-sans">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-navy/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm text-navy font-medium font-sans">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-navy/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy"
          />
        </div>

        {error && <p className="text-red-600 text-sm font-sans">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-navy text-white rounded-full px-6 py-3 text-sm uppercase tracking-[2px] font-sans hover:bg-navy-dark transition disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
    </main>
  );
}
