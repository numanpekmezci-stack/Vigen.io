"use client";

import { useState, useEffect, useCallback } from "react";

type Job = {
  id: string;
  youtube_url: string;
  video_id: string;
  status: string;
  clips: string[] | null;
  error_msg: string | null;
  created_at: string;
};

export default function ClippingPage() {
  const [url, setUrl] = useState("");
  const [clipCount, setClipCount] = useState(3);
  const [clipDuration, setClipDuration] = useState("30-60");
  const [format, setFormat] = useState("9:16");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/clip/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.jobs) setJobs(data.jobs);
    } catch {}
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // Poll active job
  useEffect(() => {
    if (!activeJobId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/clip/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_id: activeJobId }),
        });
        const data = await res.json();
        if (data.job) {
          setJobs((prev) => prev.map((j) => (j.id === activeJobId ? data.job : j)));
          if (data.job.status === "completed" || data.job.status === "failed") {
            setActiveJobId(null);
          }
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [activeJobId]);

  async function handleGenerate() {
    if (!url.trim() || submitting) return;
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/clip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, clip_count: clipCount, clip_duration: clipDuration, format }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Failed"); setSubmitting(false); return; }

      setMessage("Video queued! We'll notify you when ready.");
      setActiveJobId(data.job_id);
      setUrl("");
      fetchJobs();
    } catch {
      setMessage("Network error. Please try again.");
    }
    setSubmitting(false);
  }

  const statusColor: Record<string, string> = {
    pending: "text-[#888890]",
    downloading: "text-[#c8f135]",
    clipping: "text-[#c8f135]",
    completed: "text-emerald-400",
    failed: "text-red-400",
  };

  const statusLabel: Record<string, string> = {
    pending: "Queued",
    downloading: "Downloading...",
    clipping: "Cutting clips...",
    completed: "Ready",
    failed: "Failed",
  };

  return (
    <div className="min-h-[calc(100vh-48px)] bg-[#080809]">
      <div className="max-w-[860px] mx-auto px-6 py-10">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#f0ede8] tracking-tight">
            Turn Youtube Links into<br />
            <span className="text-[#c8f135]">Viral Clips</span>
          </h1>
          <p className="text-sm text-[#888890] mt-3">Paste a URL, AI finds the best moments, exports ready-to-post clips.</p>
        </div>

        {/* Main input */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1 flex items-center gap-3 bg-[#0f0f12] border border-[#1f1f24] rounded-xl px-4 focus-within:border-[#c8f135]/40 transition">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ff0000" className="shrink-0">
              <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/>
            </svg>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Paste youtube URL here..."
              className="flex-1 bg-transparent py-4 text-sm text-[#f0ede8] outline-none placeholder:text-[#888890]/60"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={!url.trim() || submitting}
            className="px-8 py-4 bg-[#c8f135] text-[#080809] font-bold text-sm rounded-xl hover:bg-[#b5dd2e] transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            {submitting ? "Sending..." : "Generate ⚡"}
          </button>
        </div>

        {/* Success message */}
        {message && (
          <div className={`text-center text-sm mb-6 ${message.includes("queued") ? "text-[#c8f135]" : "text-red-400"}`}>
            {message}
          </div>
        )}

        {/* Settings row */}
        <div className="flex gap-3 mb-10">
          <div className="flex-1">
            <label className="text-[0.6rem] text-[#888890] mb-1 block uppercase tracking-wider">Clips</label>
            <select value={clipCount} onChange={(e) => setClipCount(Number(e.target.value))} className="w-full bg-[#0f0f12] border border-[#1f1f24] rounded-lg px-3 py-2 text-xs text-[#f0ede8] outline-none">
              <option value={3}>3 clips</option>
              <option value={5}>5 clips</option>
              <option value={10}>10 clips</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[0.6rem] text-[#888890] mb-1 block uppercase tracking-wider">Duration</label>
            <select value={clipDuration} onChange={(e) => setClipDuration(e.target.value)} className="w-full bg-[#0f0f12] border border-[#1f1f24] rounded-lg px-3 py-2 text-xs text-[#f0ede8] outline-none">
              <option value="15-30">15–30 sec</option>
              <option value="30-60">30–60 sec</option>
              <option value="60-90">60–90 sec</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[0.6rem] text-[#888890] mb-1 block uppercase tracking-wider">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full bg-[#0f0f12] border border-[#1f1f24] rounded-lg px-3 py-2 text-xs text-[#f0ede8] outline-none">
              <option value="9:16">9:16 (TikTok / Reels)</option>
              <option value="16:9">16:9 (YouTube)</option>
              <option value="1:1">1:1 (Instagram)</option>
            </select>
          </div>
        </div>

        {/* Pending / completed jobs */}
        {jobs.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-[#888890] mb-4 uppercase tracking-wider">Your Videos</h2>
            <div className="flex flex-col gap-3">
              {jobs.map((job) => (
                <div key={job.id} className="bg-[#0f0f12] border border-[#1f1f24] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
                      <span className="text-xs text-[#f0ede8] truncate max-w-[300px]">{job.youtube_url}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(job.status === "downloading" || job.status === "clipping" || job.status === "pending") && (
                        <div className="w-3 h-3 border border-[#333] border-t-[#c8f135] rounded-full animate-spin"></div>
                      )}
                      <span className={`text-xs font-semibold ${statusColor[job.status] || "text-[#888890]"}`}>
                        {statusLabel[job.status] || job.status}
                      </span>
                    </div>
                  </div>

                  {job.status === "failed" && job.error_msg && (
                    <p className="text-xs text-red-400/70 mt-1">{job.error_msg}</p>
                  )}

                  {job.status === "completed" && job.clips && job.clips.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {job.clips.map((clip, i) => (
                        <div key={i} className="rounded-lg overflow-hidden border border-[#1f1f24] bg-[#080809]">
                          <video src={clip} controls className="w-full aspect-[9/16] object-contain bg-black" />
                          <div className="p-2 flex items-center justify-between">
                            <span className="text-[0.6rem] text-[#888890]">Clip {i + 1}</span>
                            <a href={clip} download target="_blank" className="text-[0.6rem] text-[#c8f135] hover:underline">Download</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-[0.55rem] text-[#888890]/50 mt-2">
                    {new Date(job.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {jobs.length === 0 && !message && (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-[#0f0f12] grid place-items-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888890" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            </div>
            <p className="text-sm text-[#888890]">No clips yet</p>
            <p className="text-xs text-[#888890]/50 mt-1">Paste a YouTube URL above to get started</p>
          </div>
        )}

      </div>
    </div>
  );
}
