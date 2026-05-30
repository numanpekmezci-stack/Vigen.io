"use client";

import { useState } from "react";

const categories = [
  { id: "trending", label: "🔥 Trending" },
  { id: "characters", label: "🎭 Characters" },
  { id: "mashups", label: "🎬 Mashups" },
  { id: "fruits", label: "🍓 Fruits" },
];

const templates = [
  { emoji: "🪵🦈", name: "Tung Tung Sahur", count: 12, views: "4.2M", cat: "trending" },
  { emoji: "🐊✈️", name: "Bombardiro Crocodilo", count: 8, views: "5.3M", cat: "trending" },
  { emoji: "🗿🎺", name: "Tralalero Tralala", count: 10, views: "3.1M", cat: "characters" },
  { emoji: "🧠💥", name: "Brain Melt", count: 6, views: "1.8M", cat: "mashups" },
  { emoji: "💀🎵", name: "Skull Beats", count: 7, views: "2.1M", cat: "characters" },
  { emoji: "👁️🌀", name: "Hypno Loop", count: 9, views: "1.5M", cat: "mashups" },
  { emoji: "🍓😊", name: "Strawberry Class", count: 14, views: "6.7M", cat: "fruits" },
  { emoji: "🦍❄️", name: "Blue Gorilla", count: 5, views: "3.9M", cat: "characters" },
  { emoji: "🍍🧟", name: "Pineapple Zombie", count: 8, views: "4.1M", cat: "fruits" },
  { emoji: "🐙⚽", name: "Octopus Stadium", count: 6, views: "2.3M", cat: "characters" },
  { emoji: "🪵💀", name: "Sahur Horror", count: 4, views: "1.9M", cat: "trending" },
  { emoji: "🐊🦈", name: "Croc vs Shark", count: 7, views: "3.5M", cat: "mashups" },
];

export default function TemplatesPage() {
  const [activeCat, setActiveCat] = useState("trending");
  const filtered = activeCat === "trending"
    ? templates
    : templates.filter((t) => t.cat === activeCat);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-1">Templates</h1>
      <p className="text-[#555] text-sm mb-6">Pick a trending format and create your video</p>

      <div className="flex gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeCat === c.id
                ? "bg-[#b8f53d]/10 text-[#b8f53d] border border-[#b8f53d]/20"
                : "bg-[#0c0c0c] text-[#555] border border-[#1a1a1a] hover:border-[#333]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filtered.map((t) => (
          <button
            key={t.name}
            className="text-left rounded-2xl border border-[#1a1a1a] bg-[#0c0c0c] hover:border-[#b8f53d] transition group overflow-hidden"
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-[#111] to-[#0a0a0a] flex items-center justify-center relative">
              <span className="text-5xl group-hover:scale-110 transition">{t.emoji}</span>
              <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 border border-white/10 grid place-items-center text-xs backdrop-blur">
                ▶
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1">{t.name}</h3>
              <p className="text-xs text-[#555]">
                {t.count} templates · {t.views} views
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
