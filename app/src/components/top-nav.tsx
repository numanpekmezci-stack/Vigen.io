"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/clipping", label: "Clipping" },
  { href: "/dashboard/generate", label: "AI Generation" },
  { href: "/dashboard/templates", label: "Templates" },
  { href: "/dashboard/subtitles", label: "Subtitles" },
  { href: "/dashboard/publish", label: "Publishing" },
  { href: "/dashboard/videos", label: "My Videos" },
];

export function TopNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="border-b border-[#1a1a1a] bg-[#080809] sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center h-12">
        <Link href="/dashboard" className="flex items-center gap-2 mr-6 shrink-0">
          <div className="w-6 h-6 rounded-md bg-[#b8f53d] text-black font-bold text-[0.6rem] grid place-items-center">V</div>
          <span className="font-bold text-sm">Vigen</span>
        </Link>

        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition ${
                  active ? "text-white bg-[#1a1a1d]" : "text-[#555] hover:text-[#999]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <Link href="#" className="px-3 py-1 bg-[#b8f53d] text-black text-[0.65rem] font-bold rounded-md hover:bg-[#a5dd30] transition">
            Upgrade
          </Link>
          <button onClick={handleLogout} className="text-[0.65rem] text-[#444] hover:text-[#888] transition truncate max-w-[100px]">
            {userEmail.split("@")[0]}
          </button>
        </div>
      </div>
    </header>
  );
}
