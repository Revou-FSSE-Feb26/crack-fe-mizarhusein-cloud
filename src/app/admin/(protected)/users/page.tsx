"use client";

import { useEffect, useState } from "react";
import type { AdminUser, SessionUser, UserRole } from "../../../../types";

const ROLE_TABS: { label: string; value: UserRole | "ALL" }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Admin", value: "ADMIN" },
  { label: "Customer", value: "CUSTOMER" },
];

const ROLE_STYLES: Record<UserRole, string> = {
  ADMIN: "bg-purple-50 text-purple-700",
  CUSTOMER: "bg-blue-50 text-blue-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [me, setMe] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<UserRole | "ALL">("ALL");
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { user: SessionUser | null }) => setMe(data.user?.userId ?? null))
      .catch(() => {});
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const url = activeTab === "ALL" ? "/api/admin/users" : `/api/admin/users?role=${activeTab}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat pengguna.");
      setUsers((await res.json()) as AdminUser[]);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data pengguna. Pastikan server backend menyala.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function changeRole(user: AdminUser, role: UserRole) {
    if (role === user.role) return;
    if (!window.confirm(`Ubah role ${user.email} menjadi ${role}?`)) return;
    await mutate(user.id, () =>
      fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
    );
  }

  async function remove(user: AdminUser) {
    if (
      !window.confirm(
        `Hapus akun ${user.email}? Reservasi dan pesanannya tetap tersimpan, tetapi tidak lagi terhubung ke akun ini.`
      )
    ) {
      return;
    }
    await mutate(user.id, () => fetch(`/api/admin/users/${user.id}`, { method: "DELETE" }));
  }

  async function mutate(id: number, request: () => Promise<Response>) {
    setBusyId(id);
    setError(null);
    try {
      const res = await request();
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Permintaan gagal.");
      }
      await loadUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Permintaan gagal.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="px-8 py-8">
      <h1 className="font-serif text-2xl font-semibold text-navy">Users</h1>
      <p className="text-sm text-navy/60 font-sans mt-1 mb-6">
        Kelola akun: ubah role atau hapus akun. Perubahan role berlaku langsung.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-sans transition ${
              activeTab === tab.value ? "bg-navy text-white" : "bg-white text-navy/70 hover:bg-navy/5"
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
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-sm font-sans text-navy/50">
          Belum ada pengguna.
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="text-left text-navy/40 text-xs uppercase tracking-wide">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Email</th>
                <th className="pb-3 pr-4 font-medium">Role</th>
                <th className="pb-3 pr-4 font-medium">Joined</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === me;
                return (
                  <tr key={user.id} className="border-t border-navy/5 text-navy">
                    <td className="py-3 pr-4">
                      {user.name || "-"}
                      {isSelf && <span className="ml-2 text-xs text-navy/40">(you)</span>}
                    </td>
                    <td className="py-3 pr-4 text-navy/70">{user.email}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_STYLES[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-navy/70">{formatDate(user.createdAt)}</td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-3">
                        <select
                          aria-label={`Role untuk ${user.email}`}
                          value={user.role}
                          disabled={isSelf || busyId === user.id}
                          onChange={(e) => changeRole(user, e.target.value as UserRole)}
                          className="rounded-lg border border-navy/20 bg-white px-2 py-1 text-xs text-navy disabled:opacity-50"
                        >
                          <option value="CUSTOMER">CUSTOMER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button
                          onClick={() => remove(user)}
                          disabled={isSelf || busyId === user.id}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 transition disabled:opacity-40"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
