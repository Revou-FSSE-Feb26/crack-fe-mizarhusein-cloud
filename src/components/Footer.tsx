export default function Footer() {
  return (
    <footer className="bg-navy text-white py-14 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="font-script text-3xl mb-1">Saluna</h3>
          <p className="text-white/60 text-sm">Island Dining & Sunset Experience</p>
        </div>

        <div className="flex gap-5">
          {["Instagram", "Facebook", "TikTok"].map((s) => (
            <span
              key={s}
              className="text-white/60 hover:text-white cursor-pointer text-sm transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <p className="text-center text-white/40 text-xs mt-10">
        © {new Date().getFullYear()} Saluna Beach Club. All rights reserved.
      </p>
    </footer>
  );
}
