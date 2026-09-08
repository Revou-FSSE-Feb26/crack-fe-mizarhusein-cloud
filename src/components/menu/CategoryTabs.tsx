"use client";

import type { MenuCategoryMeta } from "../../types";

interface Props {
  categories: MenuCategoryMeta[];
  activeCategory: string;
  onSelect: (slug: string) => void;
}

export default function CategoryTabs({ categories, activeCategory, onSelect }: Props) {
  return (
    <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-navy/10">
      <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
        {categories.map(({ slug, label }) => {
          const active = slug === activeCategory;
          return (
            <button
              key={slug}
              onClick={() => onSelect(slug)}
              className={`px-5 py-2 rounded-full text-sm font-sans tracking-wide whitespace-nowrap shrink-0 transition ${
                active
                  ? "bg-navy text-white"
                  : "text-navy/60 hover:bg-navy/5 border border-navy/10"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
