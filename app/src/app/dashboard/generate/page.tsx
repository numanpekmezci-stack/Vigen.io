"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const models = [
  { id: "veo3", name: "VEO3", desc: "Cinematic quality with natural motion", img: "/models/veo3.jpg" },
  { id: "sora2", name: "SORA2", desc: "Realistic scenes with precise prompts", img: "/models/sora2.jpg" },
  { id: "motion", name: "Motion Control", desc: "Replace anyone with a reference face", img: "/models/motion.jpg" },
  { id: "kling", name: "Kling Video", desc: "Image-to-video with start/end frames", img: "/models/kling.jpg" },
  { id: "wan", name: "WAN", desc: "Fast stylized video generation", img: "/models/wan.jpg" },
  { id: "nano", name: "Nano Banana", desc: "AI generation with reference images", img: "/models/nano.jpg" },
];

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

  const active = models.find((m) => m.id === selectedModel)!;

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
          <a href="/dashboard" className="text-xs text-[#555] hover:text-[#888] transition">← Models</a>
        </div>

        {/* Empty / generating / result state */}
        {!videoUrl && state !== "generating" && (
          <div className="flex flex-col items-center py-6 mb-5">
            <div className="w-12 h-12 rounded-full bg-[#111] grid place-items-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <p className="text-sm text-[#444]">No videos yet, start generating!</p>
          </div>
        )}

        {state === "generating" && (
          <div className="flex flex-col items-center py-10 mb-5">
            <div className="w-10 h-10 border-2 border-[#222] border-t-[#b8f53d] rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-[#555]">Generating with {active.name}...</p>
            <p className="text-xs text-[#333] mt-1">This may take 1-2 minutes</p>
          </div>
        )}

        {videoUrl && state === "done" && (
          <div className="flex justify-center mb-5">
            <div className="w-[260px] rounded-2xl overflow-hidden border border-[#1a1a1d]">
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
        <div className="grid grid-cols-[200px_1fr_170px] gap-4 items-end">

          {/* Left: Active model card (changes on selection) */}
          <div className="rounded-xl overflow-hidden border border-[#1a1a1d] bg-[#0e0e10] transition-all">
            <div className="aspect-[3/4] relative overflow-hidden">
              <Image
                src={active.img}
                alt={active.name}
                fill
                className="object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-sm font-bold">{active.name}</div>
                <div className="text-[0.6rem] text-[#999] mt-0.5">{active.desc}</div>
              </div>
            </div>
          </div>

          {/* Center: Prompt */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to create..."
            rows={7}
            maxLength={500}
            disabled={state === "generating"}
            className="w-full h-full bg-[#111113] border border-[#1a1a1d] rounded-xl p-4 text-sm outline-none resize-none placeholder:text-[#333] focus:border-[#333] transition disabled:opacity-40"
          />

          {/* Right: Upload */}
          <div className="h-full flex flex-col">
            <div className="text-[0.6rem] text-[#555] mb-1.5 text-right">Optional</div>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-1 border border-dashed border-[#222] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#333] transition bg-[#0c0c0e]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span className="text-[0.6rem] text-[#444] uppercase tracking-wide font-medium">Upload an image</span>
              <span className="text-[0.55rem] text-[#333]">5MB max</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" />
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center gap-4 mt-4">

          {/* Credits */}
          <div>
            <span className="text-xl font-bold text-[#b8f53d]">{credits !== null ? credits : "25"}</span>
            <span className="text-[#555] ml-1.5 text-xs">credits</span>
          </div>

          <div className="flex-1"></div>

          {/* Model dropdown with images */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-[#131315] border border-[#1f1f22] text-sm hover:border-[#333] transition"
            >
              <Image src={active.img} alt="" width={24} height={24} className="rounded-md object-cover" />
              <span className="font-medium text-xs">{active.name}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#131315] border border-[#1f1f22] rounded-xl overflow-hidden z-50 shadow-2xl">
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-3 text-sm hover:bg-[#1a1a1d] transition flex items-center gap-3 ${
                      selectedModel === m.id ? "text-white" : "text-[#888]"
                    }`}
                  >
                    <Image src={m.img} alt={m.name} width={36} height={36} className="rounded-lg object-cover" />
                    <span className="font-medium">{m.name}</span>
                    {selectedModel === m.id && <span className="ml-auto text-[#b8f53d]">✓</span>}
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
                  ratio === r ? "bg-[#1f1f22] text-white" : "text-[#555] hover:text-[#888]"
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
            className="px-10 py-3 rounded-full font-bold text-sm transition disabled:opacity-20 disabled:cursor-not-allowed bg-[#b8f53d] text-black hover:bg-[#a5dd30]"
          >
            {state === "generating" ? "Generating..." : "Generate ✦"}
          </button>
        </div>

      </div>
    </div>
  );
}
