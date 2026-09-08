"use client";

import { useCart } from "../../context/CartContext";
import { IconCart } from "./icons";

interface Props {
  onClick: () => void;
}

export default function CartButton({ onClick }: Props) {
  const { totalCount } = useCart();

  return (
    <button
      onClick={onClick}
      aria-label="Buka keranjang"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-navy text-white shadow-lg
      flex items-center justify-center hover:bg-navy-dark transition"
    >
      <IconCart className="w-6 h-6" />
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-aegean text-navy-dark text-xs font-sans font-semibold flex items-center justify-center">
          {totalCount}
        </span>
      )}
    </button>
  );
}
