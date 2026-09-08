"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import type { CartLine, MenuItem } from "../types";

interface CartContextValue {
  lines: CartLine[];
  addToCart: (item: MenuItem, quantity: number, notes: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const TAX_RATE = 0.1;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  function addToCart(item: MenuItem, quantity: number, notes: string) {
    const lineId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${item.id}-${Date.now()}-${Math.random()}`;
    setLines((prev) => [...prev, { lineId, item, quantity, notes }]);
  }

  function updateQuantity(lineId: string, quantity: number) {
    setLines((prev) =>
      prev.map((line) =>
        line.lineId === lineId ? { ...line, quantity: Math.max(1, quantity) } : line
      )
    );
  }

  function removeLine(lineId: string) {
    setLines((prev) => prev.filter((line) => line.lineId !== lineId));
  }

  function clearCart() {
    setLines([]);
  }

  const { totalCount, subtotal } = useMemo(() => {
    return lines.reduce(
      (acc, line) => ({
        totalCount: acc.totalCount + line.quantity,
        subtotal: acc.subtotal + line.item.price * line.quantity,
      }),
      { totalCount: 0, subtotal: 0 }
    );
  }, [lines]);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <CartContext.Provider
      value={{
        lines,
        addToCart,
        updateQuantity,
        removeLine,
        clearCart,
        totalCount,
        subtotal,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
