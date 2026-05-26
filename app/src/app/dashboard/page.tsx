import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <p className="text-[#555] text-sm mb-8">Welcome back</p>

      <div className="grid grid-cols-2 gap-5">
        {/* Templates Card */}
        <Link href="/dashboard/templates" className="group">
          <div className="relative rounded-2xl overflow-hidden bg-[#0c0c0c] border border-[#1a1a1a] hover:border-[#333] transition h-[380px] flex flex-col">
            <div className="flex-1 p-8 flex flex-col justify-center items-center">
              <h3 className="text-xl font-bold text-center mb-4">
                Pick a Brainrot Template &<br />Go Viral Instantly
              </h3>
              <div className="flex gap-3 mb-6">
                <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] grid place-items-center text-2xl">🪵</div>
                <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] grid place-items-center text-2xl">🦈</div>
                <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] grid place-items-center text-2xl">🐊</div>
                <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] grid place-items-center text-2xl">🍓</div>
              </div>
              <div className="flex gap-2 text-xs text-[#555]">
                <span className="px-2.5 py-1 rounded-full bg-[#111] border border-[#1a1a1a]">Tung Tung Sahur</span>
                <span className="px-2.5 py-1 rounded-full bg-[#111] border border-[#1a1a1a]">Bombardiro</span>
                <span className="px-2.5 py-1 rounded-full bg-[#111] border border-[#1a1a1a]">+50 more</span>
              </div>
              <div className="flex gap-2 mt-6">
                <div className="w-20 h-36 rounded-xl bg-[#111] border border-[#1a1a1a]"></div>
                <div className="w-20 h-36 rounded-xl bg-[#111] border border-[#1a1a1a]"></div>
                <div className="w-20 h-36 rounded-xl bg-[#111] border border-[#1a1a1a]"></div>
              </div>
            </div>
            <div className="p-6 pt-0 text-center">
              <h2 className="text-3xl font-bold italic text-[#b8f53d]">Templates</h2>
            </div>
          </div>
        </Link>

        {/* AI Generation Card */}
        <Link href="/dashboard/generate" className="group">
          <div className="relative rounded-2xl overflow-hidden border border-[#1a1a1a] hover:border-[#333] transition h-[380px] flex flex-col">
            {/* Background thumbnails */}
            <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-30">
              <div className="bg-gradient-to-br from-[#1a2a4a] to-[#0a1a2a]"></div>
              <div className="bg-gradient-to-br from-[#2a1a3a] to-[#1a0a2a]"></div>
              <div className="bg-gradient-to-br from-[#1a3a2a] to-[#0a2a1a]"></div>
              <div className="bg-gradient-to-br from-[#3a2a1a] to-[#2a1a0a]"></div>
              <div className="bg-gradient-to-br from-[#1a1a3a] to-[#0a0a2a]"></div>
              <div className="bg-gradient-to-br from-[#2a3a1a] to-[#1a2a0a]"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/80 to-transparent"></div>

            <div className="relative flex-1 p-8 flex flex-col justify-end">
              {/* Prompt mockup */}
              <div className="bg-[#0c0c0c]/90 backdrop-blur border border-[#242424] rounded-xl p-4 mb-4">
                <p className="text-sm text-[#555] mb-3">Describe the video you want to create...</p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-medium bg-[#b8f53d]/10 text-[#b8f53d] border border-[#b8f53d]/20">✦ VEO3</span>
                  <span className="px-3 py-1 rounded-lg text-xs text-[#555] border border-[#1a1a1a]">16:9</span>
                  <span className="px-3 py-1 rounded-lg text-xs text-[#555] border border-[#1a1a1a]">9:16</span>
                </div>
              </div>
              <div className="bg-[#b8f53d] text-black font-bold text-sm py-3 rounded-xl text-center">
                Generate ✦
              </div>
            </div>
            <div className="relative p-6 pt-0 text-center">
              <h2 className="text-3xl font-bold italic text-[#b8f53d]">AI Generation</h2>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
