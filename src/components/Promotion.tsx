import Link from "next/link";
import type { StaticImageData } from "next/image";
import goldenHour from "../assets/promotion/p_golden_hour.png";
import mediterranean from "../assets/promotion/p_taste_of_the_mediterranean.png";

interface Promo {
  image: StaticImageData;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  details?: string[];
  note?: string;
  list?: string[];
  price?: string;
  cta: string;
  href: string;
}

const PROMOTIONS: Promo[] = [
  {
    image: goldenHour,
    label: "Beverage Promotion",
    title: "Golden Hour",
    subtitle: "Two Drinks, One Unforgettable Sunset.",
    description:
      "Enjoy our signature cocktails with a special buy-one-get-one offer during golden hour.",
    details: ["Every day", "4:00 PM – 6:00 PM", "Buy 1 Get 1 Signature Cocktail"],
    note: "Valid for Saluna Spritz, Ocean Blue, and Sunset Paloma",
    cta: "View Cocktails",
    href: "/menu",
  },
  {
    image: mediterranean,
    label: "Food Promotion",
    title: "Taste of The Mediterranean",
    subtitle: "Made For Sharing, Inspired By The Coast.",
    description:
      "Share a Mediterranean feast featuring grilled seafood, fresh salads, artisan bread, and our signature beachside dessert.",
    list: [
      "Grilled seafood platter",
      "Greek salad",
      "Pita bread & hummus",
      "Lemon herb potatoes",
      "Dessert of the day",
      "Two mocktail",
    ],
    price: "IDR 599K / 2 Persons",
    cta: "Explore The Offer",
    href: "/contact",
  },
];

export default function Promotion() {
  return (
    <section className="pt-40 pb-28 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-up">
          <p className="uppercase tracking-[5px] text-sm text-navy font-sans font-medium">
            Exclusive F&amp;B Offers
          </p>
          <div className="text-navy/50 mt-3 text-lg">〜</div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {PROMOTIONS.map((promo, i) => (
            <div
              key={promo.title}
              className={`bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition duration-500 flex flex-col ${
                i % 2 === 0 ? "fade-left" : "fade-right"
              }`}
            >
              <div className="overflow-hidden">
                <img
                  src={promo.image.src}
                  alt={promo.title}
                  className="w-full h-[260px] object-cover"
                />
              </div>

              <div className="p-8 flex flex-col flex-1">
                <p className="italic font-serif text-navy/70 mb-2">
                  {promo.label}
                </p>
                <h3 className="font-serif text-3xl md:text-4xl text-[#1c1c1c] mb-3">
                  {promo.title}
                </h3>
                <p className="uppercase tracking-[1px] text-sm font-semibold text-navy mb-4">
                  {promo.subtitle}
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {promo.description}
                </p>

                {promo.details && (
                  <ul className="space-y-2 text-sm text-navy/90 font-sans mb-4">
                    {promo.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                )}

                {promo.list && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 font-sans mb-4">
                    {promo.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                {promo.note && (
                  <p className="text-sm text-gray-500 mb-6">{promo.note}</p>
                )}

                {promo.price && (
                  <p className="text-navy font-sans font-medium mb-6">
                    {promo.price}
                  </p>
                )}

                <Link
                  href={promo.href}
                  className="mt-auto inline-block text-center bg-navy text-white py-3 text-xs uppercase tracking-[2px] hover:bg-navy-dark transition duration-300 rounded"
                >
                  {promo.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
