"use client";

import { useState, useRef } from "react";

const styles = [
  { id: "bold", name: "Bold Pop", preview: "font-bold text-white", bg: "bg-[#b8f53d] text-black" },
  { id: "glow", name: "Neon Glow", preview: "font-bold text-[#b8f53d]", bg: "bg-transparent border border-[#b8f53d]" },
  { id: "minimal", name: "Minimal", preview: "font-medium text-white", bg: "bg-black/60" },
  { id: "karaoke", name: "Karaoke", preview: "font-bold text-yellow-400", bg: "bg-black/80" },
];

export default function SubtitlesPage() {
  const [selectedStyle, setSelectedStyle] = useState("bold");
  const [language, setLanguage] = useState("en");
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      <div className="mb-6">
        <h1 className="text-lg font-bold">Auto Subtitles</h1>
        <p className="text-xs text-[#555] mt-0.5">Add animated captions to any video automatically</p>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-5">
        <div>
          {/* Upload area */}
          <div className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] p-5 mb-4">
            <label className="text-xs text-[#666] mb-3 block">Upload your video</label>
            {videoFile ? (
              <div className="flex items-center gap-3 bg-[#111] rounded-lg p-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8f53d" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span className="text-sm flex-1 truncate">{videoFile}</span>
                <button onClick={() => setVideoFile(null)} className="text-xs text-[#555] hover:text-[#999]">✕</button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-10 border border-dashed border-[#222] rounded-lg flex flex-col items-center gap-2 hover:border-[#333] transition"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span className="text-xs text-[#555]">Drop video here or click to upload</span>
                <span className="text-[0.6rem] text-[#333]">MP4, MOV, WebM · Max 500MB</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0]?.name || null)} />
          </div>

          {/* Settings */}
          <div className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] p-5 mb-4">
            <h3 className="text-xs font-semibold text-[#888] mb-4">Settings</h3>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-[0.65rem] text-[#555] mb-1.5 block">Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-[#111] border border-[#1a1a1d] rounded-lg px-3 py-2.5 text-sm outline-none">
                  <option value="en">English</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="auto">Auto-detect</option>
                </select>
              </div>
              <div>
                <label className="text-[0.65rem] text-[#555] mb-1.5 block">Position</label>
                <select className="w-full bg-[#111] border border-[#1a1a1d] rounded-lg px-3 py-2.5 text-sm outline-none">
                  <option>Bottom center</option>
                  <option>Top center</option>
                  <option>Middle</option>
                </select>
              </div>
            </div>

            <label className="text-[0.65rem] text-[#555] mb-2 block">Caption style</label>
            <div className="grid grid-cols-4 gap-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s.id)}
                  className={`p-3 rounded-lg border text-center transition ${
                    selectedStyle === s.id ? "border-[#b8f53d] bg-[#b8f53d]/5" : "border-[#1a1a1d] hover:border-[#333]"
                  }`}
                >
                  <div className={`${s.bg} rounded px-2 py-1 mb-2 text-[0.6rem] mx-auto w-fit`}>
                    <span className={s.preview}>Sample</span>
                  </div>
                  <span className="text-[0.6rem] text-[#888]">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!videoFile}
            className="w-full py-3 bg-[#b8f53d] text-black font-bold text-sm rounded-xl hover:bg-[#a5dd30] transition disabled:opacity-20"
          >
            Generate Subtitles ✦
          </button>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] p-4 flex flex-col">
          <span className="text-xs text-[#555] mb-3">Preview</span>
          <div className="flex-1 aspect-[9/16] bg-[#111] rounded-lg flex items-end justify-center pb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <div className={`${styles.find(s => s.id === selectedStyle)?.bg || ""} rounded px-3 py-1.5 text-sm z-10`}>
              <span className={styles.find(s => s.id === selectedStyle)?.preview || ""}>Your subtitles here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
