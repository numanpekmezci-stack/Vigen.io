"use client";

import { useState, useEffect, useCallback } from "react";

type Video = {
  id: number;
  prompt: string;
  model: string;
  aspect_ratio: string;
  video_url: string;
  created_at: string;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      if (data.videos) setVideos(data.videos);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      <h1 className="text-lg font-bold mb-1">My Videos</h1>
      <p className="text-xs text-[#555] mb-6">Your generated videos</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#222] border-t-[#b8f53d] rounded-full animate-spin"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#1a1a1a] rounded-xl">
          <span className="text-4xl mb-4">📁</span>
          <h3 className="font-semibold mb-1">No videos yet</h3>
          <p className="text-sm text-[#555] mb-4">Create your first video to get started</p>
          <a href="/dashboard/generate" className="px-5 py-2.5 bg-[#b8f53d] text-black font-semibold text-sm rounded-lg hover:bg-[#9dd132] transition">
            Generate Video
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="rounded-xl border border-[#1a1a1d] bg-[#0c0c0e] overflow-hidden">
              {v.video_url.match(/\.(jpg|jpeg|png|webp)/) ? (
                <img src={v.video_url} alt={v.prompt} className="w-full aspect-[9/16] object-cover" />
              ) : (
                <video src={v.video_url} controls className="w-full aspect-[9/16] object-contain bg-black" />
              )}
              <div className="p-3">
                <p className="text-xs truncate mb-1">{v.prompt || "No prompt"}</p>
                <span className="text-[0.6rem] text-[#555] block mb-2">{v.model} · {v.aspect_ratio}</span>
                <a
                  href={v.video_url}
                  download={`vigen_${v.model}_${v.id}.${v.video_url.match(/\.(jpg|jpeg|png|webp)/) ? "png" : "mp4"}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#c8f135] text-[#080809] text-[0.65rem] font-bold rounded-lg hover:bg-[#b5dd2e] transition"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
