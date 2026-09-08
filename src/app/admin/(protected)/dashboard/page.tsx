import Link from "next/link";
import {
  IconBell,
  IconCalendar,
  IconClipboard,
  IconClock,
  IconEye,
  IconMore,
  IconUsers,
} from "../../../../components/admin/icons";

const STAT_CARDS = [
  {
    label: "Today's Reservations",
    value: "12",
    hint: "View details",
    icon: IconCalendar,
    bg: "bg-blue-50",
    fg: "text-blue-600",
  },
  {
    label: "Total Guests",
    value: "48",
    hint: "Today",
    icon: IconUsers,
    bg: "bg-green-50",
    fg: "text-green-600",
  },
  {
    label: "Upcoming Reservations",
    value: "7",
    hint: "Next 7 days",
    icon: IconClock,
    bg: "bg-amber-50",
    fg: "text-amber-600",
  },
  {
    label: "Total Menu Items",
    value: "24",
    hint: "View menu",
    icon: IconClipboard,
    bg: "bg-purple-50",
    fg: "text-purple-600",
  },
];

const RECENT_RESERVATIONS = [
  {
    name: "Budi Santoso",
    date: "15 Jun 2025",
    time: "18:30",
    pax: 4,
    contact: "0812 3456 7890",
    notes: "Anniversary dinner",
    status: "Confirmed",
  },
  {
    name: "Siti Nurhaliza",
    date: "15 Jun 2025",
    time: "19:00",
    pax: 2,
    contact: "0821 2345 6789",
    notes: "Seating at ocean view",
    status: "Confirmed",
  },
  {
    name: "Andi Wijaya",
    date: "16 Jun 2025",
    time: "17:30",
    pax: 6,
    contact: "0813 9876 5432",
    notes: "Birthday celebration",
    status: "Pending",
  },
  {
    name: "Dewi Lestari",
    date: "16 Jun 2025",
    time: "20:00",
    pax: 3,
    contact: "0812 1122 3344",
    notes: "No spicy food",
    status: "Confirmed",
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "Confirmed"
      ? "bg-green-50 text-green-700"
      : "bg-amber-50 text-amber-700";
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-sans font-medium ${styles}`}>
      {status}
    </span>
  );
}

export default function AdminDashboardPage() {
  return (
    <main className="px-8 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-navy">Welcome back, Admin!</h1>
          <p className="text-sm text-navy/60 font-sans mt-1">
            Here&apos;s what&apos;s happening with Saluna Beach Club today.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative">
            <IconBell className="w-5 h-5 text-navy/70" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy font-sans font-semibold text-xs">
              A
            </div>
            <span className="text-sm font-sans text-navy">Admin</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {STAT_CARDS.map(({ label, value, hint, icon: Icon, bg, fg }) => (
          <div key={label} className={`rounded-2xl p-5 ${bg}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${fg} bg-white/60 mb-4`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-sans text-navy/60 mb-1">{label}</p>
            <p className="text-2xl font-serif font-semibold text-navy mb-1">{value}</p>
            <p className={`text-xs font-sans ${fg}`}>{hint}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-lg font-semibold text-navy">Recent Reservations</h2>
          <Link
            href="/admin/reservation"
            className="text-sm font-sans text-navy/70 hover:text-navy transition"
          >
            View All Reservations →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="text-left text-navy/40 text-xs uppercase tracking-wide">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 font-medium">Time</th>
                <th className="pb-3 pr-4 font-medium">Pax</th>
                <th className="pb-3 pr-4 font-medium">Contact</th>
                <th className="pb-3 pr-4 font-medium">Request / Notes</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_RESERVATIONS.map((r) => (
                <tr key={r.name} className="border-t border-navy/5 text-navy">
                  <td className="py-3 pr-4">{r.name}</td>
                  <td className="py-3 pr-4 text-navy/70">{r.date}</td>
                  <td className="py-3 pr-4 text-navy/70">{r.time}</td>
                  <td className="py-3 pr-4 text-navy/70">{r.pax}</td>
                  <td className="py-3 pr-4 text-navy/70">{r.contact}</td>
                  <td className="py-3 pr-4 text-navy/70">{r.notes}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3 text-navy/50">
                      <IconEye className="w-4 h-4" />
                      <IconMore className="w-4 h-4" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
