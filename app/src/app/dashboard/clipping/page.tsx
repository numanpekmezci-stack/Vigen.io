"use client";

import { useState } from "react";

export default function ClippingPage() {
  const [url, setUrl] = useState("");
  const [processing, setProcessing] = useState(false);

  function handleClip() {
    if (!url.trim()) return;
    setProcessing(true);
    setTimeout(() => setProcessing(false), 3000);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold">Clipping</h1>
          <p className="text-xs text-[#555] mt-0.5">Turn YouTube videos into viral short clips</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-5">
        <div>
          {/* URL Input */}
          <div className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] p-5 mb-4">
            <label className="text-xs text-[#666] mb-2 block">Paste YouTube URL</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-[#111] border border-[#1a1a1d] rounded-lg px-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#333]"
                />
              </div>
              <button
                onClick={handleClip}
                disabled={!url.trim() || processing}
                className="px-5 py-3 bg-[#b8f53d] text-black text-sm font-bold rounded-lg hover:bg-[#a5dd30] transition disabled:opacity-20"
              >
                {processing ? "Processing..." : "Clip ✦"}
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] p-5 mb-4">
            <h3 className="text-xs font-semibold text-[#888] mb-4">Clip Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[0.65rem] text-[#555] mb-1.5 block">Number of clips</label>
                <select className="w-full bg-[#111] border border-[#1a1a1d] rounded-lg px-3 py-2.5 text-sm outline-none">
                  <option>3 clips</option>
                  <option>5 clips</option>
                  <option>10 clips</option>
                </select>
              </div>
              <div>
                <label className="text-[0.65rem] text-[#555] mb-1.5 block">Clip duration</label>
                <select className="w-full bg-[#111] border border-[#1a1a1d] rounded-lg px-3 py-2.5 text-sm outline-none">
                  <option>15-30 seconds</option>
                  <option>30-60 seconds</option>
                  <option>60-90 seconds</option>
                </select>
              </div>
              <div>
                <label className="text-[0.65rem] text-[#555] mb-1.5 block">Format</label>
                <select className="w-full bg-[#111] border border-[#1a1a1d] rounded-lg px-3 py-2.5 text-sm outline-none">
                  <option>9:16 (TikTok/Reels)</option>
                  <option>16:9 (YouTube)</option>
                  <option>1:1 (Instagram)</option>
                </select>
              </div>
              <div>
                <label className="text-[0.65rem] text-[#555] mb-1.5 block">Auto subtitles</label>
                <select className="w-full bg-[#111] border border-[#1a1a1d] rounded-lg px-3 py-2.5 text-sm outline-none">
                  <option>Yes — English</option>
                  <option>Yes — German</option>
                  <option>No subtitles</option>
                </select>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { n: "1", t: "Paste URL", d: "Drop any YouTube video link" },
              { n: "2", t: "AI analyzes", d: "Finds the best viral moments" },
              { n: "3", t: "Get clips", d: "Download or publish directly" },
            ].map((s) => (
              <div key={s.n} className="rounded-lg border border-[#1a1a1d] bg-[#0c0c0e] p-3">
                <span className="text-[0.6rem] text-[#b8f53d] font-bold">{s.n}</span>
                <h4 className="text-xs font-semibold mt-1">{s.t}</h4>
                <p className="text-[0.6rem] text-[#444] mt-0.5">{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: preview */}
        <div className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] p-4 flex flex-col">
          <span className="text-xs text-[#555] mb-3">Preview</span>
          <div className="flex-1 flex items-center justify-center border border-dashed border-[#1a1a1d] rounded-lg">
            <div className="text-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" className="mx-auto mb-2"><rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
              <p className="text-[0.65rem] text-[#333]">Clips will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
