"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

const models = [
  { id: "veo3", name: "VEO3", desc: "Cinematic quality with natural motion", img: "/models/veo3.jpg", type: "text" },
  { id: "sora2", name: "SORA2", desc: "Realistic scenes with precise prompts", img: "/models/sora2.jpg", type: "text" },
  { id: "motion", name: "Motion Control", desc: "Create AI videos fast with just one prompt", img: "/models/motion.jpg", type: "motion" },
  { id: "kling", name: "Kling Video", desc: "Image-to-video with start/end frames", img: "/models/kling.jpg", type: "text" },
  { id: "wan", name: "WAN", desc: "Fast stylized video generation", img: "/models/wan.jpg", type: "text" },
  { id: "nano", name: "Nano Banana", desc: "AI generation with reference images", img: "/models/nano.jpg", type: "text" },
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoRefUrl, setVideoRefUrl] = useState<string | null>(null);
  const [videoRefName, setVideoRefName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [motionMode, setMotionMode] = useState<"standard" | "pro">("standard");
  const [motionOrientation, setMotionOrientation] = useState<"video" | "image">("video");
  const [sceneControl, setSceneControl] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const active = models.find((m) => m.id === selectedModel)!;
  const isMotion = active.type === "motion";

  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/credits");
      const data = await res.json();
      if (data.credits !== undefined) setCredits(data.credits);
    } catch {}
  }, []);

  useEffect(() => { fetchCredits(); }, [fetchCredits]);

  async function handleUpload(file: File, type: "image" | "video") {
    const maxSize = type === "image" ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) { setError(`File too large (max ${type === "image" ? "5MB" : "100MB"})`); return; }
    setUploading(true);
    setError("");

    if (type === "image") {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setVideoRefName(file.name);
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        if (type === "image") setImagePreview(null);
        else setVideoRefName(null);
      } else {
        if (type === "image") setImageUrl(data.url);
        else setVideoRefUrl(data.url);
      }
    } catch {
      setError("Upload failed");
    }
    setUploading(false);
  }

  function removeImage() { setImageUrl(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }
  function removeVideo() { setVideoRefUrl(null); setVideoRefName(null); if (videoRef.current) videoRef.current.value = ""; }

  async function handleGenerate() {
    if (!prompt.trim() || state === "generating") return;
    if (isMotion && !imageUrl) { setError("Motion Control requires a reference image."); return; }

    setState("generating");
    setError("");
    setVideoUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel, aspect_ratio: ratio, image_url: imageUrl }),
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

  const creditCost = motionMode === "pro" ? 70 : 40;
  const creditsPercent = credits !== null ? Math.max(0, Math.min(100, (credits / 500) * 100)) : 100;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#080809]">
      <div className="max-w-[1100px] mx-auto px-6 py-5">

        {/* Top */}
        <div className="flex items-center justify-between mb-5">
          <a href="/dashboard" className="text-xs text-[#555] hover:text-[#888] transition">← Models</a>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#111] border border-[#1a1a1d]">
            <span className="text-sm font-bold text-[#b8f53d]">{credits !== null ? credits : "—"}</span>
            <span className="text-xs text-[#555]">credits</span>
            <div className="w-20 h-1.5 rounded-full bg-[#1a1a1d]">
              <div className="h-full rounded-full bg-[#b8f53d] transition-all duration-500" style={{ width: `${creditsPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Result area */}
        {!videoUrl && state !== "generating" && (
          <div className="flex flex-col items-center py-6 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#111] grid place-items-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <p className="text-sm text-[#444]">No videos yet, start generating!</p>
          </div>
        )}
        {state === "generating" && (
          <div className="flex flex-col items-center py-10 mb-4">
            <div className="w-10 h-10 border-2 border-[#222] border-t-[#b8f53d] rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-[#555]">Generating with {active.name}...</p>
            <p className="text-xs text-[#333] mt-1">~1-2 minutes</p>
          </div>
        )}
        {videoUrl && state === "done" && (
          <div className="flex justify-center mb-4">
            <div className="w-[240px] rounded-2xl overflow-hidden border border-[#1a1a1d]">
              <video src={videoUrl} controls autoPlay loop className="w-full aspect-[9/16] object-contain bg-black" />
            </div>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs text-center max-w-md mx-auto">{error}</div>
        )}

        {/* Main area */}
        {isMotion ? (
          /* MOTION CONTROL LAYOUT */
          <div className="grid grid-cols-[180px_1fr_auto] gap-4 items-end">
            {/* Left: model card */}
            <div className="rounded-xl overflow-hidden border border-[#1a1a1d] bg-[#0e0e10]">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image src={active.img} alt={active.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-sm font-bold">{active.name}</div>
                  <div className="text-[0.6rem] text-[#999] mt-0.5">{active.desc}</div>
                </div>
              </div>
            </div>

            {/* Center: motion controls + prompt */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-6 text-xs">
                <span className="text-[#666]">Mode</span>
                <div className="flex gap-1 bg-[#111] rounded-full p-0.5 border border-[#1a1a1d]">
                  <button onClick={() => setMotionMode("standard")} className={`px-3 py-1.5 rounded-full transition ${motionMode === "standard" ? "bg-[#1f1f22] text-white" : "text-[#555]"}`}>Standard · 40 cr</button>
                  <button onClick={() => setMotionMode("pro")} className={`px-3 py-1.5 rounded-full transition ${motionMode === "pro" ? "bg-[#1f1f22] text-white" : "text-[#555]"}`}>Pro · 70 cr</button>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <span className="text-[#666]">Scene control</span>
                <button onClick={() => setSceneControl(!sceneControl)} className={`w-9 h-5 rounded-full transition relative ${sceneControl ? "bg-[#b8f53d]" : "bg-[#222]"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${sceneControl ? "left-[18px]" : "left-0.5"}`}></div>
                </button>
              </div>
              <div>
                <span className="text-[0.65rem] text-[#666] mb-1 block">Prompt</span>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='Describe background and scene details – e.g., "A corgi runs in" or "Snowy park setting"...'
                  rows={3}
                  maxLength={500}
                  disabled={state === "generating"}
                  className="w-full bg-[#111113] border border-[#1a1a1d] rounded-lg p-3 text-sm outline-none resize-none placeholder:text-[#333] focus:border-[#333] transition disabled:opacity-40"
                />
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-[#666]">Orientation</span>
                <div className="flex gap-1 bg-[#111] rounded-full p-0.5 border border-[#1a1a1d]">
                  <button onClick={() => setMotionOrientation("video")} className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${motionOrientation === "video" ? "bg-[#1f1f22] text-white" : "text-[#555]"}`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    From video
                  </button>
                  <button onClick={() => setMotionOrientation("image")} className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${motionOrientation === "image" ? "bg-[#1f1f22] text-white" : "text-[#555]"}`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    From image
                  </button>
                </div>
              </div>
              <p className="text-[0.6rem] text-[#444]">Character follows both movements and orientation from the {motionOrientation} (max 30s)</p>
            </div>

            {/* Right: upload image + video */}
            <div className="flex gap-3">
              <div className="w-[140px]">
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-[#1a1a1d] aspect-square">
                    <img src={imagePreview} alt="Ref" className="w-full h-full object-cover" />
                    {uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center"><div className="w-5 h-5 border-2 border-[#333] border-t-[#b8f53d] rounded-full animate-spin"></div></div>}
                    <button onClick={removeImage} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 grid place-items-center text-[0.6rem] text-white">✕</button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()} className="w-full aspect-square border border-dashed border-[#b8f53d]/30 rounded-xl flex flex-col items-center justify-center gap-1.5 bg-[#0c0c0e] hover:border-[#b8f53d]/50 transition">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <span className="text-[0.55rem] text-[#444] uppercase tracking-wide font-medium">Upload an image</span>
                    <span className="text-[0.5rem] text-[#333]">5MB max</span>
                  </button>
                )}
              </div>
              <div className="w-[140px]">
                {videoRefName ? (
                  <div className="relative rounded-xl border border-[#1a1a1d] aspect-square bg-[#0e0e10] flex flex-col items-center justify-center p-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b8f53d" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <span className="text-[0.55rem] text-[#888] mt-1.5 truncate w-full text-center">{videoRefName}</span>
                    <button onClick={removeVideo} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 grid place-items-center text-[0.6rem] text-white">✕</button>
                  </div>
                ) : (
                  <button onClick={() => videoRef.current?.click()} className="w-full aspect-square border border-dashed border-[#222] rounded-xl flex flex-col items-center justify-center gap-1.5 bg-[#0c0c0e] hover:border-[#333] transition">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="10" y1="2" x2="10" y2="22"/><polygon points="14 8 20 12 14 16 14 8"/></svg>
                    <span className="text-[0.55rem] text-[#444] uppercase tracking-wide font-medium">Upload a video</span>
                    <span className="text-[0.5rem] text-[#333]">100MB max</span>
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "image"); }} />
              <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "video"); }} />
            </div>
          </div>
        ) : (
          /* DEFAULT LAYOUT */
          <div className="grid grid-cols-[200px_1fr_170px] gap-4 items-end">
            <div className="rounded-xl overflow-hidden border border-[#1a1a1d] bg-[#0e0e10]">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image src={active.img} alt={active.name} fill className="object-cover transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-sm font-bold">{active.name}</div>
                  <div className="text-[0.6rem] text-[#999] mt-0.5">{active.desc}</div>
                </div>
              </div>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to create..."
              rows={7}
              maxLength={500}
              disabled={state === "generating"}
              className="w-full h-full bg-[#111113] border border-[#1a1a1d] rounded-xl p-4 text-sm outline-none resize-none placeholder:text-[#333] focus:border-[#333] transition disabled:opacity-40"
            />
            <div className="h-full flex flex-col">
              <div className="text-[0.6rem] text-[#555] mb-1.5 text-right">Optional</div>
              {imagePreview ? (
                <div className="flex-1 relative rounded-xl overflow-hidden border border-[#1a1a1d]">
                  <img src={imagePreview} alt="Reference" className="w-full h-full object-cover" />
                  {uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center"><div className="w-5 h-5 border-2 border-[#333] border-t-[#b8f53d] rounded-full animate-spin"></div></div>}
                  <button onClick={removeImage} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 grid place-items-center text-xs text-white">✕</button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="flex-1 border border-dashed border-[#222] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#333] transition bg-[#0c0c0e]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span className="text-[0.6rem] text-[#444] uppercase tracking-wide font-medium">Upload image</span>
                  <span className="text-[0.55rem] text-[#333]">5MB max</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "image"); }} />
              <input ref={videoRef} type="file" accept="video/*" className="hidden" />
            </div>
          </div>
        )}

        {/* Bottom controls */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-[#131315] border border-[#1f1f22] text-sm hover:border-[#333] transition">
              <Image src={active.img} alt="" width={24} height={24} className="rounded-md object-cover" />
              <span className="font-medium text-xs">{active.name}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#131315] border border-[#1f1f22] rounded-xl overflow-hidden z-50 shadow-2xl">
                {models.map((m) => (
                  <button key={m.id} onClick={() => { setSelectedModel(m.id); setDropdownOpen(false); }} className={`w-full text-left px-3 py-3 text-sm hover:bg-[#1a1a1d] transition flex items-center gap-3 ${selectedModel === m.id ? "text-white" : "text-[#888]"}`}>
                    <Image src={m.img} alt={m.name} width={36} height={36} className="rounded-lg object-cover" />
                    <div>
                      <span className="font-medium block text-xs">{m.name}</span>
                      {m.type === "motion" && <span className="text-[0.55rem] text-[#b8f53d]">Image + Video input</span>}
                    </div>
                    {selectedModel === m.id && <span className="ml-auto text-[#b8f53d]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isMotion && (
            <div className="flex gap-1 bg-[#111] rounded-full p-1 border border-[#1a1a1d]">
              {["16:9", "9:16"].map((r) => (
                <button key={r} onClick={() => setRatio(r)} className={`px-4 py-2 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${ratio === r ? "bg-[#1f1f22] text-white" : "text-[#555]"}`}>
                  <span className={`inline-block border ${ratio === r ? "border-white" : "border-[#444]"} ${r === "16:9" ? "w-4 h-2.5" : "w-2.5 h-4"} rounded-sm`}></span>
                  {r}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1"></div>

          <span className="text-xs text-[#333]">{isMotion ? creditCost : 50} credits</span>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || state === "generating" || (isMotion && !imageUrl)}
            className="px-10 py-3 rounded-full font-bold text-sm transition disabled:opacity-20 disabled:cursor-not-allowed bg-[#b8f53d] text-black hover:bg-[#a5dd30]"
          >
            {state === "generating" ? "Generating..." : "Generate ✦"}
          </button>
        </div>

      </div>
    </div>
  );
}
