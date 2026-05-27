import Link from "next/link";

const tools = [
  {
    href: "/dashboard/clipping",
    title: "Turn YouTube Links into Viral Clips",
    label: "Clipping",
    desc: "Paste a YouTube URL, AI cuts the best moments, adds subtitles, optimized for TikTok/Reels/Shorts.",
    gradient: "from-[#111] to-[#0a0a0c]",
  },
  {
    href: "/dashboard/generate",
    title: "Generate viral AI videos",
    label: "AI Generation",
    desc: "Create any video with VEO3, SORA2, Kling Video, WAN, Nano Banana and more. Just describe it.",
    gradient: "from-[#0f0f18] to-[#0a0a0c]",
  },
];

const extraTools = [
  {
    href: "/dashboard/templates",
    icon: "🎬",
    title: "Templates",
    desc: "50+ brainrot character templates ready to use",
  },
  {
    href: "/dashboard/subtitles",
    icon: "💬",
    title: "Auto Subtitles",
    desc: "Add animated captions to any video automatically",
  },
  {
    href: "/dashboard/publish",
    icon: "📱",
    title: "Auto Publishing",
    desc: "Schedule & post to TikTok, Reels and Shorts in one click",
  },
  {
    href: "/dashboard/videos",
    icon: "📁",
    title: "My Videos",
    desc: "View and manage all your generated content",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      <p className="text-[#555] text-xs mb-5">Welcome back</p>

      {/* Two main feature cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="group">
            <div className={`rounded-2xl border border-[#1a1a1d] bg-gradient-to-br ${t.gradient} p-6 h-[280px] flex flex-col justify-between hover:border-[#333] transition`}>
              <div>
                <h3 className="text-base font-bold mb-2 leading-snug">{t.title}</h3>
                <p className="text-xs text-[#555] leading-relaxed max-w-[280px]">{t.desc}</p>
              </div>
              <div>
                <span className="text-2xl font-bold italic text-[#b8f53d]">{t.label}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Extra tools grid */}
      <p className="text-xs text-[#555] mb-3 font-medium">Tools</p>
      <div className="grid grid-cols-4 gap-3">
        {extraTools.map((t) => (
          <Link key={t.href} href={t.href} className="group">
            <div className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] p-4 hover:border-[#333] transition h-full">
              <span className="text-xl mb-3 block">{t.icon}</span>
              <h3 className="text-sm font-semibold mb-1">{t.title}</h3>
              <p className="text-[0.65rem] text-[#555] leading-relaxed">{t.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
