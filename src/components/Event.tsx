import Link from "next/link";
import heroEvent from "../assets/background/hero_event.png";
import eventFooter from "../assets/background/event_footer.png";
import sunsetSession from "../assets/event/sunset_session.png";
import moonlightDinner from "../assets/event/moonlight_dinner.png";

const EVENTS = [
  {
    image: sunsetSession,
    name: "Sunset Session",
    tagline: "Live DJ, Signature Cocktails, Ocean View",
    description:
      "Rayakan datangnya senja bersama iringan DJ set dan koktail signature kami, tepat di tepi pantai dengan pemandangan matahari terbenam yang megah.",
    schedule: "Setiap Jumat & Sabtu",
    time: "17:00 – 20:00",
  },
  {
    image: moonlightDinner,
    name: "Moonlight Dinner",
    tagline: "Candlelit Table, Curated Menu, Sea Breeze",
    description:
      "Nikmati makan malam romantis dengan meja berhias lilin, menu pilihan chef, dan suara ombak di bawah cahaya bulan purnama.",
    schedule: "Setiap Sabtu",
    time: "19:00 – 22:00",
  },
];

export default function Event() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] w-full overflow-hidden bg-navy">
        <img
          src={heroEvent.src}
          alt="Saluna Beach Club event"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/50" />
        <div className="relative z-10 flex min-h-[70vh] items-center justify-center text-center px-6">
          <div className="max-w-2xl text-white fade-up">
            <p className="uppercase tracking-[5px] text-sm mb-6">
              Signature Events
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-normal leading-tight">
              Moments Made <br /> By The Sea
            </h1>
          </div>
        </div>
      </section>

      {/* Event Cards */}
      <section className="py-28 px-6 bg-cream">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          {EVENTS.map((event, i) => (
            <div
              key={event.name}
              className={`group bg-white rounded-[30px] overflow-hidden shadow-sm hover:shadow-xl transition duration-500 ${
                i % 2 === 0 ? "fade-left" : "fade-right"
              }`}
            >
              <div className="overflow-hidden">
                <img
                  src={event.image.src}
                  alt={event.name}
                  className="w-full h-[320px] object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
              <div className="p-10">
                <p className="uppercase tracking-[3px] text-xs text-navy/60 font-sans mb-3">
                  {event.tagline}
                </p>
                <h3 className="font-serif text-3xl md:text-4xl text-navy mb-4">
                  {event.name}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-navy/80 font-sans">
                  <span>📅 {event.schedule}</span>
                  <span>🕒 {event.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="relative min-h-[45vh] w-full overflow-hidden">
        <img
          src={eventFooter.src}
          alt="Reserve your table at Saluna Beach Club"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex min-h-[45vh] items-center justify-center text-center px-6">
          <div className="fade-up">
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
              Reserve Your Spot
            </h2>
            <Link
              href="/contact"
              className="inline-block border border-white text-white px-10 py-4 uppercase tracking-[3px] text-sm hover:bg-white hover:text-navy transition duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
