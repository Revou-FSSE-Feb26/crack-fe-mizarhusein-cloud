"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { formatRupiah } from "../../lib/format";
import { IconClose, IconMinus, IconPlus, IconTrash } from "./icons";

interface Props {
  onClose: () => void;
}

export default function CartDrawer({ onClose }: Props) {
  const { lines, updateQuantity, removeLine, clearCart, subtotal, tax, total } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmitOrder() {
    setStatus("loading");
    setErrorMessage("");
    setOrderId(null);
    try {
      // Only ids and quantities are sent; the server looks up prices and totals itself.
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          tableNumber,
          items: lines.map((l) => ({
            menuId: l.item.id,
            quantity: l.quantity,
            notes: l.notes,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(data.error || "Gagal mengirim pesanan. Coba lagi.");
        setStatus("error");
        return;
      }
      setOrderId(data.order?.id ?? null);
      setStatus("success");
      clearCart();
    } catch {
      setErrorMessage("Gagal menghubungi server. Coba lagi.");
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="modal-backdrop absolute inset-0 bg-navy-dark/50" onClick={onClose} />
      <div className="drawer-panel relative bg-white w-full max-w-md h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy/10">
          <h2 className="font-serif text-xl text-navy">Pesanan Anda</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full flex items-center justify-center text-navy/50 hover:bg-navy/5"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <p className="text-center text-gray-400 text-sm mt-10">Keranjang masih kosong</p>
          ) : (
            <div className="flex flex-col gap-4">
              {lines.map((line) => (
                <div key={line.lineId} className="flex gap-3 border-b border-navy/5 pb-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-navy">{line.item.name}</p>
                    <p className="text-xs text-aegean font-sans mt-0.5">
                      {formatRupiah(line.item.price)}
                    </p>
                    {line.notes && (
                      <p className="text-xs text-gray-400 italic mt-1">"{line.notes}"</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy/5"
                        aria-label="Kurangi"
                      >
                        <IconMinus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm text-navy w-4 text-center">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy/5"
                        aria-label="Tambah"
                      >
                        <IconPlus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeLine(line.lineId)}
                        className="ml-auto text-navy/40 hover:text-navy"
                        aria-label="Hapus"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {status === "success" && lines.length === 0 && (
          <div className="border-t border-navy/10 px-6 py-5 text-center">
            <p className="text-sm text-aegean font-sans font-medium">Pesanan berhasil dikirim!</p>
            {orderId !== null && (
              <p className="text-xs text-navy/60 font-sans mt-1">
                Nomor pesanan Anda: <span className="font-semibold text-navy">#{orderId}</span>
              </p>
            )}
          </div>
        )}

        {lines.length > 0 && (
          <div className="border-t border-navy/10 px-6 py-5">
            <div className="flex justify-between text-sm text-navy/70 font-sans">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-navy/70 font-sans mt-1">
              <span>Pajak (10%)</span>
              <span>{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between font-sans font-semibold text-navy mt-2 text-base">
              <span>Total</span>
              <span>{formatRupiah(total)}</span>
            </div>

            <>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    maxLength={60}
                    placeholder="Nama (opsional)"
                    className="border border-navy/20 rounded-lg px-3 py-2 text-sm font-sans text-navy outline-none focus:border-navy"
                  />
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    maxLength={20}
                    placeholder="No. meja (opsional)"
                    className="border border-navy/20 rounded-lg px-3 py-2 text-sm font-sans text-navy outline-none focus:border-navy"
                  />
                </div>
                <button
                  onClick={handleSubmitOrder}
                  disabled={status === "loading"}
                  className="w-full mt-5 py-3 rounded-full bg-navy text-white font-sans text-sm hover:bg-navy-dark transition disabled:opacity-60"
                >
                  {status === "loading" ? "Mengirim..." : "Pesan Sekarang"}
                </button>
                {status === "error" && (
                  <p className="text-center text-xs text-red-500 mt-2">{errorMessage}</p>
                )}
            </>
          </div>
        )}
      </div>
    </div>
  );
}
