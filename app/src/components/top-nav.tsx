"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/templates", label: "Templates" },
  { href: "/dashboard/generate", label: "AI Generation" },
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
    <header className="border-b border-[#1a1a1a] bg-[#060606]">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center h-14">
        <Link href="/dashboard" className="flex items-center gap-2 mr-8">
          <div className="w-7 h-7 rounded-lg bg-[#b8f53d] text-black font-bold text-xs grid place-items-center">
            V
          </div>
          <span className="font-bold text-sm">Vigen</span>
        </Link>

        <nav className="flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  active
                    ? "text-white font-medium"
                    : "text-[#555] hover:text-[#999]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/generate"
            className="px-4 py-1.5 bg-[#b8f53d] text-black text-xs font-bold rounded-lg hover:bg-[#9dd132] transition"
          >
            Upgrade
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1a1a1a] grid place-items-center text-xs">
              👤
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-[#555] hover:text-[#999] transition"
            >
              {userEmail.split("@")[0]}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
