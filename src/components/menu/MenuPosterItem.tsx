import type { MenuItem } from "../../types";
import { formatRupiah } from "../../lib/format";
import { IconPlate, IconTap } from "./icons";

interface Props {
  item: MenuItem;
  index: number;
  onClick: () => void;
}

export default function MenuPosterItem({ item, index, onClick }: Props) {
  const reversed = index % 2 === 1;

  return (
    <div
      className={`flex flex-col md:flex-row ${
        reversed ? "md:flex-row-reverse" : ""
      } items-center gap-6 md:gap-14 py-10 border-b border-navy/10 last:border-0`}
    >
      <button
        onClick={onClick}
        aria-label={`Pilih ${item.name}`}
        className="group relative shrink-0 w-56 h-56 md:w-64 md:h-64 rounded-full bg-aegean-light/25
        overflow-hidden flex items-center justify-center"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <IconPlate className="w-14 h-14 text-aegean" />
        )}

        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="tap-ring absolute w-12 h-12 rounded-full bg-white/70" />
          <span className="relative w-11 h-11 rounded-full bg-white/90 shadow flex items-center justify-center text-navy">
            <IconTap className="w-5 h-5" />
          </span>
        </span>
      </button>

      <div className="flex-1 text-center md:text-left">
        <h3 className="font-serif text-2xl md:text-3xl text-navy">{item.name}</h3>
        <span className="block text-aegean font-sans font-semibold text-lg mt-1">
          {formatRupiah(item.price)}
        </span>
        {item.description && (
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-3 max-w-md mx-auto md:mx-0">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}
