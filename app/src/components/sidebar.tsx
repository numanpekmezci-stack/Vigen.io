"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⚡" },
  { href: "/dashboard/templates", label: "Templates", icon: "🎬" },
  { href: "/dashboard/generate", label: "AI Generate", icon: "✦" },
  { href: "/dashboard/videos", label: "My Videos", icon: "📁" },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-56 border-r border-[#1a1a1a] bg-[#0a0a0a] flex flex-col p-4 shrink-0">
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-[#b8f53d] text-black font-bold text-xs grid place-items-center">
          V
        </div>
        <span className="font-bold text-sm">Vigen Studio</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${
                active
                  ? "bg-[#b8f53d]/10 text-[#b8f53d] font-medium"
                  : "text-[#666] hover:text-[#999] hover:bg-[#111]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#1a1a1a] pt-4 mt-4">
        <div className="text-xs text-[#444] truncate px-2 mb-3">{userEmail}</div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-[#555] hover:text-[#999] rounded-lg hover:bg-[#111] transition"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
