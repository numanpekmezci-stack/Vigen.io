"use client";

import { useState } from "react";

const models = [
  { id: "veo3", name: "VEO3", desc: "Cinematic quality", badge: "Popular" },
  { id: "sora2", name: "SORA2", desc: "Realistic scenes", badge: "Premium" },
  { id: "kling", name: "Kling Video", desc: "Image-to-video", badge: "" },
  { id: "wan", name: "WAN", desc: "Fast & affordable", badge: "Fast" },
  { id: "nano", name: "Nano Banana", desc: "14 reference images", badge: "New" },
  { id: "motion", name: "Motion Control", desc: "Face transfer", badge: "" },
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("veo3");
  const [ratio, setRatio] = useState("9:16");

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">AI Generate</h1>
      <p className="text-[#666] text-sm mb-8">
        Describe your video and pick a model
      </p>

      <div className="rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] p-6 mb-6">
        <label className="text-xs text-[#888] mb-2 block">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A wooden character dancing on a tropical beach with a baby shark..."
          rows={4}
          className="w-full bg-[#060606] border border-[#1a1a1a] rounded-lg p-4 text-sm outline-none focus:border-[#b8f53d] transition resize-none"
        />

        <div className="flex items-center gap-3 mt-4">
          <label className="text-xs text-[#888]">Aspect Ratio</label>
          {["9:16", "16:9", "1:1"].map((r) => (
            <button
              key={r}
              onClick={() => setRatio(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                ratio === r
                  ? "border-[#b8f53d] text-[#b8f53d] bg-[#b8f53d]/10"
                  : "border-[#1a1a1a] text-[#555] hover:border-[#333]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <h2 className="text-sm font-semibold text-[#888] mb-4">Select Model</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {models.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedModel(m.id)}
            className={`text-left p-4 rounded-xl border transition ${
              selectedModel === m.id
                ? "border-[#b8f53d] bg-[#b8f53d]/5"
                : "border-[#1a1a1a] bg-[#0c0c0c] hover:border-[#333]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm">{m.name}</h3>
              {m.badge && (
                <span className="text-[0.6rem] px-2 py-0.5 rounded-full bg-[#1a1a1a] text-[#888] uppercase font-semibold">
                  {m.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-[#555]">{m.desc}</p>
          </button>
        ))}
      </div>

      <button
        disabled={!prompt.trim()}
        className="w-full py-4 bg-[#b8f53d] text-black font-bold rounded-xl hover:bg-[#9dd132] transition disabled:opacity-30 disabled:cursor-not-allowed text-sm"
      >
        Generate Video ✦
      </button>
    </div>
  );
}
