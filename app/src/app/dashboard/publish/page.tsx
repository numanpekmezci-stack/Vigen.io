"use client";

import { useState } from "react";

const platforms = [
  { id: "tiktok", name: "TikTok", icon: "🎵", connected: false },
  { id: "instagram", name: "Instagram Reels", icon: "📸", connected: false },
  { id: "youtube", name: "YouTube Shorts", icon: "▶️", connected: false },
];

export default function PublishPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [caption, setCaption] = useState("");

  function togglePlatform(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      <div className="mb-6">
        <h1 className="text-lg font-bold">Auto Publishing</h1>
        <p className="text-xs text-[#555] mt-0.5">Schedule & publish to all platforms in one click</p>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-5">
        <div>
          {/* Connect platforms */}
          <div className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] p-5 mb-4">
            <h3 className="text-xs font-semibold text-[#888] mb-4">Platforms</h3>
            <div className="flex flex-col gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                    selected.includes(p.id) ? "border-[#b8f53d] bg-[#b8f53d]/5" : "border-[#1a1a1d] hover:border-[#333]"
                  }`}
                >
                  <span className="text-lg">{p.icon}</span>
                  <span className="text-sm font-medium flex-1 text-left">{p.name}</span>
                  {selected.includes(p.id) ? (
                    <span className="text-[#b8f53d] text-xs font-semibold">Selected ✓</span>
                  ) : (
                    <span className="text-xs text-[#444]">Click to select</span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[0.6rem] text-[#333] mt-3">Connect your accounts in Settings to enable direct publishing.</p>
          </div>

          {/* Caption & hashtags */}
          <div className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] p-5 mb-4">
            <label className="text-xs text-[#666] mb-2 block">Caption & Hashtags</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your caption... #brainrot #viral #tungtungsahur"
              rows={4}
              className="w-full bg-[#111] border border-[#1a1a1d] rounded-lg p-3 text-sm outline-none resize-none placeholder:text-[#333] focus:border-[#333] transition"
            />
            <button className="mt-2 text-[0.65rem] text-[#b8f53d] hover:underline">✦ Auto-generate hashtags</button>
          </div>

          {/* Schedule */}
          <div className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] p-5 mb-4">
            <h3 className="text-xs font-semibold text-[#888] mb-4">Schedule</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] text-[#555] mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-[#111] border border-[#1a1a1d] rounded-lg px-3 py-2.5 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-[0.65rem] text-[#555] mb-1.5 block">Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-[#111] border border-[#1a1a1d] rounded-lg px-3 py-2.5 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              disabled={selected.length === 0}
              className="flex-1 py-3 bg-[#b8f53d] text-black font-bold text-sm rounded-xl hover:bg-[#a5dd30] transition disabled:opacity-20"
            >
              Publish Now
            </button>
            <button
              disabled={selected.length === 0 || !scheduleDate}
              className="flex-1 py-3 border border-[#1a1a1d] text-sm font-semibold rounded-xl hover:border-[#333] transition disabled:opacity-20 text-[#888]"
            >
              Schedule
            </button>
          </div>
        </div>

        {/* Right: Video select */}
        <div className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] p-4 flex flex-col">
          <span className="text-xs text-[#555] mb-3">Select video to publish</span>
          <div className="flex-1 flex items-center justify-center border border-dashed border-[#1a1a1d] rounded-lg">
            <div className="text-center p-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" className="mx-auto mb-2"><rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
              <p className="text-[0.65rem] text-[#333] mb-2">No video selected</p>
              <a href="/dashboard/videos" className="text-[0.65rem] text-[#b8f53d] hover:underline">Choose from My Videos →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
