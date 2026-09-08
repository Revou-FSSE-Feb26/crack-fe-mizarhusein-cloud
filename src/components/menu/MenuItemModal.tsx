"use client";

import { useState } from "react";
import type { MenuItem } from "../../types";
import { formatRupiah } from "../../lib/format";
import { useCart } from "../../context/CartContext";
import { IconClose, IconMinus, IconPlus, IconPlate } from "./icons";

interface Props {
  item: MenuItem;
  onClose: () => void;
  onAdded: (item: MenuItem) => void;
}

export default function MenuItemModal({ item, onClose, onAdded }: Props) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  function toggleOption(groupId: string, optionId: string, type: "single" | "multiple") {
    setSelected((prev) => {
      const current = prev[groupId] ?? [];
      if (type === "single") {
        return { ...prev, [groupId]: [optionId] };
      }
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [groupId]: next };
    });
  }

  function handleSubmit() {
    addToCart(item, quantity, notes);
    onAdded(item);
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[60] bg-navy-dark/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white rounded-[28px] w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="aspect-square bg-aegean-light/25 flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <IconPlate className="w-16 h-16 text-aegean" />
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-navy hover:bg-white"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="font-serif text-2xl text-navy">{item.name}</h2>
          <span className="block text-aegean font-sans font-semibold mt-1">
            {formatRupiah(item.price)}
          </span>
          {item.description && (
            <p className="text-gray-500 text-sm leading-relaxed mt-3">{item.description}</p>
          )}

          {item.optionGroups?.map((group) => (
            <div key={group.id} className="mt-5">
              <p className="text-sm font-sans font-medium text-navy mb-2">
                {group.label}
                {group.required && <span className="text-aegean"> *</span>}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {group.options.map((option) => {
                  const isSelected = (selected[group.id] ?? []).includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleOption(group.id, option.id, group.type)}
                      className={`text-left px-3 py-2 rounded-lg border text-sm transition ${
                        isSelected
                          ? "border-aegean bg-aegean/10 text-navy"
                          : "border-navy/10 text-navy/70 hover:bg-navy/5"
                      }`}
                    >
                      {option.label}
                      {option.priceDelta > 0 && (
                        <span className="block text-xs text-gray-400">
                          +{formatRupiah(option.priceDelta)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-6">
            <p className="text-sm font-sans font-medium text-navy mb-2">Jumlah</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy/5"
                aria-label="Kurangi"
              >
                <IconMinus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-sans text-navy">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy/5"
                aria-label="Tambah"
              >
                <IconPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-sans font-medium text-navy mb-2 block">
              Catatan (opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: tanpa bawang, pedas sedang, dll."
              rows={2}
              className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:border-aegean"
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-navy/20 text-navy font-sans text-sm hover:bg-navy/5 transition"
            >
              Kembali
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-full bg-navy text-white font-sans text-sm hover:bg-navy-dark transition"
            >
              Tambah ke Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
