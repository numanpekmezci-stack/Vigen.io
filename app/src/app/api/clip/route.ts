import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);
const TMP_DIR = path.join(process.cwd(), "tmp");

function ensureTmp() {
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { url, clip_count, clip_duration, format } = await request.json();
    if (!url?.trim()) return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });

    const videoId = extractVideoId(url);
    if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });

    // Save job to Supabase
    const { data: job, error: insertErr } = await supabase.from("clip_jobs").insert({
      user_id: user.id,
      youtube_url: url,
      video_id: videoId,
      clip_count: clip_count || 3,
      clip_duration: clip_duration || "30-60",
      format: format || "9:16",
      status: "pending",
    }).select().single();

    if (insertErr) {
      console.error("Insert error:", insertErr);
      return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }

    // Start processing in background (non-blocking)
    processClipJob(job.id, videoId, clip_count || 3, clip_duration || "30-60", user.id).catch(console.error);

    return NextResponse.json({ job_id: job.id, status: "pending" });
  } catch (err) {
    console.error("Clip error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

async function processClipJob(jobId: string, videoId: string, clipCount: number, duration: string, userId: string) {
  ensureTmp();
  const supabase = await getSupabase();

  try {
    await supabase.from("clip_jobs").update({ status: "downloading" }).eq("id", jobId);

    const videoPath = path.join(TMP_DIR, `${jobId}.mp4`);

    // Download with yt-dlp (more reliable than ytdl-core)
    try {
      await execAsync(`yt-dlp -f "best[height<=720]" -o "${videoPath}" "https://youtube.com/watch?v=${videoId}"`, { timeout: 120000 });
    } catch {
      // Fallback: try ytdl-core
      const ytdl = await import("ytdl-core");
      const stream = ytdl.default(`https://youtube.com/watch?v=${videoId}`, { quality: "highest" });
      const ws = fs.createWriteStream(videoPath);
      await new Promise<void>((resolve, reject) => {
        stream.pipe(ws);
        ws.on("finish", resolve);
        ws.on("error", reject);
        stream.on("error", reject);
      });
    }

    if (!fs.existsSync(videoPath)) {
      await supabase.from("clip_jobs").update({ status: "failed", error_msg: "Download failed" }).eq("id", jobId);
      return;
    }

    await supabase.from("clip_jobs").update({ status: "clipping" }).eq("id", jobId);

    // Get video duration
    const { stdout: durationOut } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
    );
    const totalDuration = parseFloat(durationOut.trim());

    // Parse clip duration range
    const [minDur, maxDur] = duration.split("-").map(Number);
    const clipDur = Math.min(maxDur || 45, totalDuration / clipCount);
    const actualClipDur = Math.max(minDur || 15, clipDur);

    const clips: string[] = [];
    const interval = Math.max(0, (totalDuration - actualClipDur) / clipCount);

    for (let i = 0; i < clipCount && i * interval < totalDuration; i++) {
      const start = Math.floor(i * interval);
      const clipPath = path.join(TMP_DIR, `${jobId}_clip_${i}.mp4`);

      await execAsync(
        `ffmpeg -y -ss ${start} -i "${videoPath}" -t ${actualClipDur} -c:v libx264 -c:a aac -preset fast -crf 23 "${clipPath}"`,
        { timeout: 60000 }
      );

      if (fs.existsSync(clipPath)) {
        // Upload to Supabase Storage
        const fileBuffer = fs.readFileSync(clipPath);
        const storagePath = `${userId}/${jobId}/clip_${i}.mp4`;

        await supabase.storage.from("uploads").upload(storagePath, fileBuffer, { contentType: "video/mp4" });
        const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(storagePath);
        clips.push(urlData.publicUrl);

        fs.unlinkSync(clipPath);
      }
    }

    // Cleanup source
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

    await supabase.from("clip_jobs").update({
      status: "completed",
      clips: clips,
      completed_at: new Date().toISOString(),
    }).eq("id", jobId);

  } catch (err) {
    console.error("Processing error:", err);
    await supabase.from("clip_jobs").update({
      status: "failed",
      error_msg: err instanceof Error ? err.message : "Processing failed",
    }).eq("id", jobId);
  }
}
