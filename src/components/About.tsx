export default function About() {
  return (
    <section className="py-28 px-6 bg-cream">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <div className="fade-left">
          <img
            src="/background/bg_hero.png"
            alt="Saluna Beach Club terrace"
            className="rounded-[30px] shadow-2xl w-full"
          />
        </div>

        <div className="fade-right">
          <p className="uppercase tracking-[4px] text-sm mb-4 text-navy/70 font-sans">
            About Us
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-normal mb-8 leading-tight text-navy">
            Island Dining <br />
            Sunset Experience
          </h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Saluna Beach Club menghadirkan pengalaman bersantap tepi laut
            dengan pemandangan matahari terbenam yang memukau. Setiap sudut
            dirancang untuk menghadirkan ketenangan pulau dan kehangatan
            perjamuan bersama orang-orang terkasih.
          </p>
        </div>
      </div>
    </section>
  );
}
