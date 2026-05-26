import Link from "next/link";

const quickActions = [
  {
    href: "/dashboard/templates",
    icon: "🎬",
    title: "Browse Templates",
    desc: "Trending brainrot formats ready to use",
    color: "bg-purple-500/10 border-purple-500/20",
  },
  {
    href: "/dashboard/generate",
    icon: "✦",
    title: "AI Generate",
    desc: "Create any video with VEO3, SORA2, Kling & more",
    color: "bg-[#b8f53d]/10 border-[#b8f53d]/20",
  },
  {
    href: "/dashboard/videos",
    icon: "📁",
    title: "My Videos",
    desc: "View and manage your generated videos",
    color: "bg-cyan-500/10 border-cyan-500/20",
  },
];

const stats = [
  { label: "Videos Created", value: "0" },
  { label: "Total Views", value: "0" },
  { label: "Credits Left", value: "5" },
];

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">Welcome to Vigen</h1>
      <p className="text-[#666] text-sm mb-8">Create your first viral video</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-5 rounded-xl border border-[#1a1a1a] bg-[#0c0c0c]"
          >
            <div className="text-2xl font-bold mb-1">{s.value}</div>
            <div className="text-xs text-[#555]">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-[#888] mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-4">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`p-5 rounded-xl border ${a.color} hover:scale-[1.02] transition`}
          >
            <span className="text-2xl mb-3 block">{a.icon}</span>
            <h3 className="font-semibold text-sm mb-1">{a.title}</h3>
            <p className="text-xs text-[#666] leading-relaxed">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
