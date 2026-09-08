"use client";

import { useEffect, useState } from "react";
import type { MenuItem } from "../../../../types";
import { MENU_CATEGORIES } from "../../../../data/menuCategories";
import { formatRupiah } from "../../../../lib/format";

type FormState = {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: MENU_CATEGORIES[0].slug,
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadItems() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/menu");
      if (!res.ok) throw new Error("Gagal memuat data menu.");
      const data = (await res.json()) as MenuItem[];
      setItems(data);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data menu. Pastikan server backend menyala.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  }

  function openEditForm(item: MenuItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      image: item.image,
      category: item.category,
    });
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const price = Number(form.price);
    if (!form.name.trim() || !form.category || !Number.isFinite(price) || price <= 0) {
      setFormError("Nama, kategori, dan harga (angka positif) wajib diisi.");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      image: form.image.trim(),
      category: form.category,
    };

    try {
      const res = await fetch(
        editingId ? `/api/admin/menu/${editingId}` : "/api/admin/menu",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Gagal menyimpan menu.");
      }
      setFormOpen(false);
      await loadItems();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Gagal menyimpan menu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus item menu ini?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus menu.");
      await loadItems();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gagal menghapus menu.");
    } finally {
      setDeletingId(null);
    }
  }

  const categoryLabel = (slug: string) =>
    MENU_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

  return (
    <main className="px-8 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy">Menu</h1>
          <p className="text-sm text-navy/60 font-sans mt-1">
            Kelola item menu yang tampil di halaman publik /menu.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-5 py-2.5 rounded-full bg-navy text-white text-sm font-sans hover:bg-navy-dark transition"
        >
          + Tambah Menu
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6">
        {loading && <p className="text-sm text-navy/60 font-sans py-10 text-center">Memuat...</p>}
        {error && <p className="text-sm text-red-500 font-sans py-10 text-center">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="text-left text-navy/40 text-xs uppercase tracking-wide">
                  <th className="pb-3 pr-4 font-medium">Foto</th>
                  <th className="pb-3 pr-4 font-medium">Nama</th>
                  <th className="pb-3 pr-4 font-medium">Kategori</th>
                  <th className="pb-3 pr-4 font-medium">Harga</th>
                  <th className="pb-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-navy/5 text-navy">
                    <td className="py-3 pr-4">
                      <div className="w-12 h-12 rounded-lg bg-aegean-light/25 overflow-hidden flex items-center justify-center">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4">{item.name}</td>
                    <td className="py-3 pr-4 text-navy/70">{categoryLabel(item.category)}</td>
                    <td className="py-3 pr-4 text-navy/70">{formatRupiah(item.price)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEditForm(item)}
                          className="text-xs font-sans text-navy/70 hover:text-navy underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-xs font-sans text-red-500 hover:text-red-600 underline disabled:opacity-50"
                        >
                          {deletingId === item.id ? "Menghapus..." : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-navy/50">
                      Belum ada item menu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen && (
        <div
          className="fixed inset-0 z-50 bg-navy-dark/50 flex items-center justify-center p-4"
          onClick={() => setFormOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-lg font-semibold text-navy mb-5">
              {editingId ? "Edit Menu" : "Tambah Menu"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-sans text-navy/60 block mb-1">Nama</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy focus:outline-none focus:border-aegean"
                />
              </div>

              <div>
                <label className="text-xs font-sans text-navy/60 block mb-1">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy focus:outline-none focus:border-aegean"
                >
                  {MENU_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-sans text-navy/60 block mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy focus:outline-none focus:border-aegean"
                />
              </div>

              <div>
                <label className="text-xs font-sans text-navy/60 block mb-1">
                  Path Foto (contoh: /menu/pizza/margherita.png)
                </label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy focus:outline-none focus:border-aegean"
                />
              </div>

              <div>
                <label className="text-xs font-sans text-navy/60 block mb-1">
                  Deskripsi (opsional untuk drinks)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy focus:outline-none focus:border-aegean"
                />
              </div>

              {formError && <p className="text-xs text-red-500">{formError}</p>}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-navy/20 text-navy text-sm hover:bg-navy/5 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-full bg-navy text-white text-sm hover:bg-navy-dark transition disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
