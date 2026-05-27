"use client";

import { useState, useRef } from "react";

const models = [
  { id: "veo3", name: "VEO3", icon: "🎬" },
  { id: "sora2", name: "SORA2", icon: "🌐" },
  { id: "motion", name: "Motion Control", icon: "🎭" },
  { id: "kling", name: "Kling Video", icon: "⚡" },
  { id: "wan", name: "WAN", icon: "🎨" },
  { id: "nano", name: "Nano Banana", icon: "🍌" },
];

const modelMeta: Record<string, { title: string; desc: string }> = {
  veo3: { title: "VEO3", desc: "Cinematic quality with natural motion" },
  sora2: { title: "SORA2", desc: "Realistic scenes, precise prompts" },
  motion: { title: "Motion Control", desc: "Face transfer & replacement" },
  kling: { title: "Kling Video", desc: "Image-to-video with start/end frames" },
  wan: { title: "WAN", desc: "Create AI videos fast with just one prompt" },
  nano: { title: "Nano Banana", desc: "AI generation with reference images" },
};

type GenState = "idle" | "generating" | "done" | "error";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("wan");
  const [ratio, setRatio] = useState("9:16");
  const [state, setState] = useState<GenState>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const meta = modelMeta[selectedModel];

  async function handleGenerate() {
    if (!prompt.trim() || state === "generating") return;
    setState("generating");
    setError("");
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel, aspect_ratio: ratio }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed"); setState("error"); return; }
      setVideoUrl(data.video_url);
      if (data.credits_remaining !== undefined) setCredits(data.credits_remaining);
      setState("done");
    } catch {
      setError("Network error. Please try again.");
      setState("error");
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#080809]">
      <div className="max-w-[1100px] mx-auto px-6 py-5">

        {/* Top */}
        <div className="flex items-center justify-between mb-5">
          <a href="/dashboard" className="text-xs text-[#555] hover:text-[#888] transition flex items-center gap-1">
            ← Models
          </a>
          <div className="flex items-center gap-4">
            {state === "done" && videoUrl && (
              <a href={videoUrl} download target="_blank" className="text-xs text-[#555] hover:text-[#888] transition">
                ↓ Download
              </a>
            )}
          </div>
        </div>

        {/* Empty state top */}
        {!videoUrl && state !== "generating" && (
          <div className="flex flex-col items-center py-6 mb-5">
            <div className="w-12 h-12 rounded-full bg-[#111] grid place-items-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <p className="text-sm text-[#444]">No videos yet, start generating!</p>
          </div>
        )}

        {/* Generating state */}
        {state === "generating" && (
          <div className="flex flex-col items-center py-10 mb-5">
            <div className="w-10 h-10 border-2 border-[#222] border-t-[#7c5cfc] rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-[#555]">Generating with {meta.title}...</p>
            <p className="text-xs text-[#333] mt-1">This may take 1-2 minutes</p>
          </div>
        )}

        {/* Video result */}
        {videoUrl && state === "done" && (
          <div className="flex justify-center mb-5">
            <div className="w-[280px] rounded-2xl overflow-hidden border border-[#1a1a1d] bg-[#0c0c0e]">
              <video src={videoUrl} controls autoPlay loop className="w-full aspect-[9/16] object-contain bg-black" />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Bottom area: model card + prompt + upload */}
        <div className="grid grid-cols-[220px_1fr_180px] gap-4 items-end">

          {/* Model preview card */}
          <div className="rounded-xl overflow-hidden border border-[#1a1a1d] bg-[#0c0c0e]">
            <div className="aspect-[3/4] bg-gradient-to-br from-[#151518] to-[#0a0a0c] flex items-center justify-center relative">
              <span className="text-5xl opacity-40">⚔️</span>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-sm font-bold">{meta.title}</div>
                <div className="text-[0.6rem] text-[#888] mt-0.5">{meta.desc}</div>
              </div>
            </div>
          </div>

          {/* Prompt area */}
          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to create..."
              rows={6}
              maxLength={500}
              disabled={state === "generating"}
              className="w-full bg-[#111113] border border-[#1a1a1d] rounded-xl p-4 text-sm outline-none resize-none placeholder:text-[#333] focus:border-[#333] transition disabled:opacity-40"
            />
          </div>

          {/* Upload */}
          <div>
            <div className="text-[0.6rem] text-[#555] mb-1.5 text-right">Optional</div>
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full aspect-[3/4] border border-dashed border-[#222] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#333] transition bg-[#0c0c0e]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span className="text-[0.65rem] text-[#444] uppercase tracking-wide font-medium">Upload an image</span>
              <span className="text-[0.55rem] text-[#333]">5MB max</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" />
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center gap-4 mt-4">

          {/* Credits */}
          <div className="text-sm">
            <span className="text-2xl font-bold text-[#7c5cfc]">{credits !== null ? credits : "25"}</span>
            <span className="text-[#555] ml-1.5 text-xs">credits</span>
          </div>

          <div className="flex-1"></div>

          {/* Model dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#18181b] border border-[#222] text-sm hover:border-[#333] transition"
            >
              <span className="text-[#7c5cfc] text-xs">✦</span>
              <span className="font-medium text-xs">{meta.title}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 mb-1 w-48 bg-[#141416] border border-[#222] rounded-xl overflow-hidden z-50 shadow-2xl">
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-[#1a1a1d] transition flex items-center gap-2 ${
                      selectedModel === m.id ? "text-white" : "text-[#666]"
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.name}</span>
                    {selectedModel === m.id && <span className="ml-auto text-[#7c5cfc]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Format */}
          <div className="flex gap-1 bg-[#111] rounded-full p-1 border border-[#1a1a1d]">
            {["16:9", "9:16"].map((r) => (
              <button
                key={r}
                onClick={() => setRatio(r)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                  ratio === r
                    ? "bg-[#222] text-white"
                    : "text-[#555] hover:text-[#888]"
                }`}
              >
                <span className={`inline-block border ${ratio === r ? "border-white" : "border-[#444]"} ${r === "16:9" ? "w-4 h-2.5" : "w-2.5 h-4"} rounded-sm`}></span>
                {r}
              </button>
            ))}
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || state === "generating"}
            className="px-10 py-3 rounded-full font-bold text-sm transition disabled:opacity-20 disabled:cursor-not-allowed bg-[#7c5cfc] text-white hover:bg-[#6a4ce0]"
          >
            {state === "generating" ? "Generating..." : "Generate ✦"}
          </button>
        </div>

      </div>
    </div>
  );
}
