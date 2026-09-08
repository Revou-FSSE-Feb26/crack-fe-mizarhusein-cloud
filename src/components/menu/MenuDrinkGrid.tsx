import type { MenuItem } from "../../types";
import { formatRupiah } from "../../lib/format";
import { IconPlate, IconTap } from "./icons";

interface Props {
  items: MenuItem[];
  onSelect: (item: MenuItem) => void;
}

export default function MenuDrinkGrid({ items, onSelect }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8 py-10">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="group flex items-center gap-4 text-left"
        >
          <span className="relative shrink-0 w-20 h-20 rounded-full bg-aegean-light/25 overflow-hidden flex items-center justify-center">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <IconPlate className="w-8 h-8 text-aegean" />
            )}
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="tap-ring absolute w-8 h-8 rounded-full bg-white/70" />
              <span className="relative w-6 h-6 rounded-full bg-white/90 shadow flex items-center justify-center text-navy">
                <IconTap className="w-3 h-3" />
              </span>
            </span>
          </span>
          <span>
            <span className="block text-xs text-navy/40 font-sans">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="block font-serif text-lg text-navy">{item.name}</span>
            <span className="block text-aegean font-sans font-medium text-sm">
              {formatRupiah(item.price)}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
