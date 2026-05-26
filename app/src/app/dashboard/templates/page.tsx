const templates = [
  { emoji: "🪵🦈", name: "Tung Tung Sahur", count: 12, views: "4.2M" },
  { emoji: "🐊✈️", name: "Bombardiro Crocodilo", count: 8, views: "5.3M" },
  { emoji: "🗿🎺", name: "Tralalero Tralala", count: 10, views: "3.1M" },
  { emoji: "🧠💥", name: "Brain Melt", count: 6, views: "1.8M" },
  { emoji: "💀🎵", name: "Skull Beats", count: 7, views: "2.1M" },
  { emoji: "👁️🌀", name: "Hypno Loop", count: 9, views: "1.5M" },
  { emoji: "🍓😊", name: "Fruit Characters", count: 14, views: "6.7M" },
  { emoji: "🦍❄️", name: "Blue Gorilla", count: 5, views: "3.9M" },
];

export default function TemplatesPage() {
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-1">Templates</h1>
      <p className="text-[#666] text-sm mb-8">
        Pick a trending format and create your video
      </p>

      <div className="grid grid-cols-4 gap-4">
        {templates.map((t) => (
          <button
            key={t.name}
            className="text-left p-4 rounded-xl border border-[#1a1a1a] bg-[#0c0c0c] hover:border-[#b8f53d] hover:bg-[#b8f53d]/5 transition group"
          >
            <div className="text-3xl mb-3">{t.emoji}</div>
            <h3 className="font-semibold text-sm mb-1">{t.name}</h3>
            <p className="text-xs text-[#555]">
              {t.count} templates · {t.views} views
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
