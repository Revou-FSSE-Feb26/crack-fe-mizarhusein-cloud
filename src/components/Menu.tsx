"use client";

import { useState, useEffect } from "react";
import type { MenuItem } from "../types";
import { MENU_CATEGORIES } from "../data/menuCategories";
import { CATEGORY_BADGES } from "../data/categoryBadges";
import { CartProvider } from "../context/CartContext";
import CategoryTabs from "./menu/CategoryTabs";
import MenuPosterItem from "./menu/MenuPosterItem";
import MenuDrinkGrid from "./menu/MenuDrinkGrid";
import MenuItemModal from "./menu/MenuItemModal";
import RecommendationModal from "./menu/RecommendationModal";
import HomeButton from "./menu/HomeButton";
import CartButton from "./menu/CartButton";
import CartDrawer from "./menu/CartDrawer";

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].slug);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [recommendationContext, setRecommendationContext] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json() as Promise<MenuItem[]>;
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(async (e) => {
        console.error(e);
        setError("Gagal memuat menu. Coba buka /api/menu di browser untuk lihat error detail.");
        setLoading(false);
      });
  }, []);

  const filtered = items.filter((i) => i.category === activeCategory);
  const activeLabel = MENU_CATEGORIES.find((c) => c.slug === activeCategory)?.label ?? "";
  const badges = CATEGORY_BADGES[activeCategory];
  const isDrinks = activeCategory === "drinks";

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        {!loading && !error && (
          <CategoryTabs
            categories={MENU_CATEGORIES}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        )}

        <div className="max-w-3xl mx-auto px-6 pb-32">
          {loading && (
            <div className="flex justify-center py-32">
              <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && <div className="text-center py-32 text-red-500">{error}</div>}

          {!loading && !error && (
            <>
              <div className="text-center pt-14 pb-2">
                <h1 className="font-serif text-4xl md:text-5xl text-navy">{activeLabel}</h1>
                <div className="flex items-center justify-center gap-2 mt-3 text-aegean">
                  <span className="w-8 h-px bg-aegean/40" />
                  <span className="w-1.5 h-1.5 rotate-45 bg-aegean/70" />
                  <span className="w-8 h-px bg-aegean/40" />
                </div>
              </div>

              {isDrinks ? (
                <MenuDrinkGrid items={filtered} onSelect={setSelectedItem} />
              ) : (
                <div>
                  {filtered.map((item, index) => (
                    <MenuPosterItem
                      key={item.id}
                      item={item}
                      index={index}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              )}

              {badges && (
                <div className="mt-4 mb-10 rounded-2xl border border-aegean/30 bg-aegean-light/15 px-6 py-5 text-center">
                  <p className="font-serif text-navy text-sm tracking-[2px] uppercase mb-3">
                    {activeLabel} Selection
                  </p>
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-navy/70 font-sans">
                    {badges.map((badge) => (
                      <span key={badge}>{badge}</span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-center text-xs text-gray-400 font-sans">
                Semua harga belum termasuk pajak pemerintah 10%.
              </p>
            </>
          )}
        </div>
      </div>

      <HomeButton />
      <CartButton onClick={() => setCartOpen(true)} />
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdded={(item) => {
            setSelectedItem(null);
            setRecommendationContext(item);
          }}
        />
      )}

      {recommendationContext && (
        <RecommendationModal
          justAdded={recommendationContext}
          allItems={items}
          onClose={() => setRecommendationContext(null)}
        />
      )}
    </CartProvider>
  );
}
