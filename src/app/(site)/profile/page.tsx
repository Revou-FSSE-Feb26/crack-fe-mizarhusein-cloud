"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AccountTabs from "../../../components/auth/AccountTabs";
import type { SessionUser } from "../../../types";

interface Profile extends Omit<SessionUser, "userId"> {
  id: number;
  createdAt: string;
}

const INPUT_CLASS =
  "w-full rounded-lg border border-navy/20 px-4 py-3 text-navy outline-none placeholder:text-navy/40 focus:border-navy";

type Notice = { kind: "success" | "error"; text: string } | null;

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [nameNotice, setNameNotice] = useState<Notice>(null);
  const [passwordNotice, setPasswordNotice] = useState<Notice>(null);
  const [saving, setSaving] = useState<"name" | "password" | null>(null);

  useEffect(() => {
    fetch("/api/users/me", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/login?next=/profile");
          return;
        }
        const data = (await res.json()) as Profile;
        setProfile(data);
        setName(data.name ?? "");
      })
      .catch(() => setNameNotice({ kind: "error", text: "Gagal memuat profil." }));
  }, [router]);

  async function save(
    kind: "name" | "password",
    payload: Record<string, string>,
    setNotice: (n: Notice) => void
  ) {
    setNotice(null);
    setSaving(kind);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNotice({ kind: "error", text: data.error || "Gagal menyimpan." });
        return false;
      }
      setNotice({ kind: "success", text: "Tersimpan." });
      // The navbar shows the name, so ask it to look at the (new) session again.
      window.dispatchEvent(new Event("saluna:session-changed"));
      return true;
    } catch {
      setNotice({ kind: "error", text: "Gagal menghubungi server. Coba lagi nanti." });
      return false;
    } finally {
      setSaving(null);
    }
  }

  async function handleName(e: FormEvent) {
    e.preventDefault();
    await save("name", { name }, setNameNotice);
  }

  async function handlePassword(e: FormEvent) {
    e.preventDefault();
    const ok = await save("password", { currentPassword, newPassword }, setPasswordNotice);
    if (ok) {
      setCurrentPassword("");
      setNewPassword("");
    }
  }

  return (
    <main className="min-h-screen bg-cream px-6 pb-20 pt-36">
      <section className="mx-auto max-w-md">
        <p className="text-center text-xs uppercase tracking-[3px] text-navy/60">
          Saluna Beach Club
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl text-navy md:text-5xl">Profil</h1>
        <AccountTabs />

        {!profile ? (
          <p className="mt-10 text-center text-sm text-navy/60">Memuat...</p>
        ) : (
          <div className="mt-10 flex flex-col gap-6">
            <form onSubmit={handleName} className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl text-navy">Data Akun</h2>
              <div>
                <label className="mb-2 block text-sm font-medium text-navy">Email</label>
                <input value={profile.email} disabled className={`${INPUT_CLASS} bg-navy/5 text-navy/60`} />
                <p className="mt-1 text-xs text-navy/50">Email tidak dapat diubah.</p>
              </div>
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-navy">
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  required
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              {nameNotice && (
                <p className={`text-center text-sm ${nameNotice.kind === "success" ? "text-emerald-600" : "text-red-500"}`}>
                  {nameNotice.text}
                </p>
              )}
              <button
                type="submit"
                disabled={saving === "name"}
                className="rounded-full bg-navy px-6 py-3 text-xs uppercase tracking-[2px] text-white transition hover:bg-navy-dark disabled:opacity-60"
              >
                {saving === "name" ? "Menyimpan..." : "Simpan Nama"}
              </button>
            </form>

            <form onSubmit={handlePassword} className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl text-navy">Ganti Password</h2>
              <div>
                <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-navy">
                  Password Saat Ini
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-navy">
                  Password Baru
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
              {passwordNotice && (
                <p className={`text-center text-sm ${passwordNotice.kind === "success" ? "text-emerald-600" : "text-red-500"}`}>
                  {passwordNotice.text}
                </p>
              )}
              <button
                type="submit"
                disabled={saving === "password"}
                className="rounded-full bg-navy px-6 py-3 text-xs uppercase tracking-[2px] text-white transition hover:bg-navy-dark disabled:opacity-60"
              >
                {saving === "password" ? "Menyimpan..." : "Ganti Password"}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
