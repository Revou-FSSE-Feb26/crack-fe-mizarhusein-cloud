"use client";

import { useMemo, useState } from "react";
import type { MenuItem } from "../../types";
import { formatRupiah } from "../../lib/format";
import { useCart } from "../../context/CartContext";
import { IconClose, IconPlate, IconPlus } from "./icons";

interface Props {
  justAdded: MenuItem;
  allItems: MenuItem[];
  onClose: () => void;
}

export default function RecommendationModal({ justAdded, allItems, onClose }: Props) {
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const recommendations = useMemo(() => {
    const pool = allItems.filter((i) => i.category !== justAdded.category);
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [allItems, justAdded]);

  if (recommendations.length === 0) return null;

  function handleQuickAdd(item: MenuItem) {
    addToCart(item, 1, "");
    setAddedIds((prev) => [...prev, item.id]);
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[60] bg-navy-dark/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white rounded-[28px] w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">
              "{justAdded.name}" telah ditambahkan ke pesanan.
            </p>
            <h2 className="font-serif text-xl text-navy mt-1">Mungkin Anda juga suka</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full flex items-center justify-center text-navy/50 hover:bg-navy/5 shrink-0"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {recommendations.map((item) => {
            const added = addedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-navy/10 p-3"
              >
                <div className="w-12 h-12 rounded-full bg-aegean-light/25 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <IconPlate className="w-6 h-6 text-aegean" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-sans font-medium text-navy truncate">{item.name}</p>
                  <p className="text-xs text-aegean font-sans">{formatRupiah(item.price)}</p>
                </div>
                <button
                  onClick={() => handleQuickAdd(item)}
                  disabled={added}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition ${
                    added
                      ? "bg-navy/10 text-navy/40"
                      : "bg-navy text-white hover:bg-navy-dark"
                  }`}
                  aria-label={added ? "Sudah ditambahkan" : `Tambah ${item.name}`}
                >
                  <IconPlus className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-full border border-navy/20 text-navy font-sans text-sm hover:bg-navy/5 transition"
        >
          Nanti Saja
        </button>
      </div>
    </div>
  );
}
