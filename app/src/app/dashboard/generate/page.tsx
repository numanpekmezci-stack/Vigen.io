"use client";

import { useState } from "react";

const models = [
  { id: "veo3", name: "VEO3", version: "3.1", desc: "Cinematic quality with natural motion", badge: "Popular", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
  { id: "sora2", name: "SORA2", version: "2.0", desc: "Realistic scenes, precise prompts", badge: "Premium", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  { id: "kling", name: "Kling Video", version: "2.0", desc: "Image-to-video, multi-shot", badge: "", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
  { id: "wan", name: "WAN", version: "1.3", desc: "Fast stylized on a budget", badge: "Fast", color: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
  { id: "nano", name: "Nano Banana", version: "1.0", desc: "14 reference images", badge: "New", color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
  { id: "motion", name: "Motion Control", version: "1.2", desc: "Face transfer & replacement", badge: "", color: "bg-pink-500/10 border-pink-500/20 text-pink-400" },
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("veo3");
  const [ratio, setRatio] = useState("9:16");

  const activeModel = models.find((m) => m.id === selectedModel)!;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="grid grid-cols-[1fr_340px] gap-6">
        {/* Left: Prompt + Models */}
        <div>
          <h1 className="text-2xl font-bold mb-1">AI Generation</h1>
          <p className="text-[#555] text-sm mb-6">Create any video with the best AI models</p>

          {/* Prompt */}
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0c0c0c] p-5 mb-5">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to create..."
              rows={5}
              className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-[#444]"
            />
            <div className="flex items-center gap-2 pt-3 border-t border-[#1a1a1a] mt-2">
              {["9:16", "16:9", "1:1"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRatio(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    ratio === r
                      ? "border-[#b8f53d] text-[#b8f53d] bg-[#b8f53d]/10"
                      : "border-[#1a1a1a] text-[#444] hover:border-[#333]"
                  }`}
                >
                  {r}
                </button>
              ))}
              <div className="flex-1"></div>
              <span className="text-xs text-[#333]">{prompt.length}/500</span>
            </div>
          </div>

          <button
            disabled={!prompt.trim()}
            className="w-full py-4 bg-[#b8f53d] text-black font-bold rounded-xl hover:bg-[#9dd132] transition disabled:opacity-20 disabled:cursor-not-allowed text-sm"
          >
            Generate with {activeModel.name} ✦
          </button>

          {/* Models grid */}
          <h2 className="text-xs font-semibold text-[#555] mt-8 mb-4 uppercase tracking-wide">Models</h2>
          <div className="grid grid-cols-3 gap-3">
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{m.name}</h3>
                  {m.badge && (
                    <span className={`text-[0.6rem] px-2 py-0.5 rounded-full border uppercase font-bold ${m.color}`}>
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#444]">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0c0c0c] flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-full aspect-[9/16] rounded-xl bg-[#111] border border-[#1a1a1a] flex items-center justify-center mb-4">
              <div className="text-center">
                <span className="text-3xl block mb-2">✦</span>
                <p className="text-xs text-[#333]">Preview will appear here</p>
              </div>
            </div>
            <div className="w-full flex gap-2">
              <button className="flex-1 py-2.5 rounded-lg border border-[#1a1a1a] text-xs text-[#444] hover:border-[#333] transition">
                Download
              </button>
              <button className="flex-1 py-2.5 rounded-lg border border-[#1a1a1a] text-xs text-[#444] hover:border-[#333] transition">
                Publish
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0c0c0c] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#555]">Credits remaining</span>
              <span className="text-sm font-bold text-[#b8f53d]">5</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#111]">
              <div className="w-full h-full rounded-full bg-[#b8f53d]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
