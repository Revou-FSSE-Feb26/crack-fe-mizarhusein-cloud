import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-cream">
      {/* Decorative arch shape peeking behind the photo, top-left */}
      <div className="absolute -top-[4%] -left-[38%] w-[76%] h-[52%] rounded-full bg-cream z-10" />

      {/* Photo */}
      <div className="absolute inset-y-0 left-[3%] md:left-[4%] right-0">
        <img
          src="/background/bg_hero.png"
          alt="Saluna Beach Club terrace overlooking the sea"
          className="w-full h-full object-cover animate-zoom"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex h-screen items-center">
        <div className="max-w-2xl px-6 md:px-16 text-white fade-up">
          <p className="uppercase tracking-[5px] text-sm mb-6">
            Island Dining • Sunset Experience
          </p>
          <h1 className="font-serif text-5xl md:text-8xl font-normal leading-[1.05] mb-10">
            Where The Sea <br />
            Meets The Sunset
          </h1>
          <Link
            href="/menu"
            className="inline-block border border-white px-10 py-4 uppercase tracking-[3px] text-sm hover:bg-white hover:text-navy transition duration-300"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
