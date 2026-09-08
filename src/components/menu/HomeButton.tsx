import Link from "next/link";
import { IconHome } from "./icons";

export default function HomeButton() {
  return (
    <Link
      href="/"
      aria-label="Kembali ke beranda"
      className="fixed bottom-6 right-24 z-40 w-14 h-14 rounded-full bg-white text-navy shadow-lg border border-navy/10
      flex items-center justify-center hover:bg-navy/5 transition"
    >
      <IconHome className="w-6 h-6" />
    </Link>
  );
}
