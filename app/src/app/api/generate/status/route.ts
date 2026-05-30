import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const FAL_KEY = process.env.FAL_KEY || "";
const CREDIT_COST = 50;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
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

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ status: "FAILED", error: "Not logged in" }, { status: 401 });
    }

    const { response_url, request_id, prompt, model, aspect_ratio } = await request.json();

    if (!response_url || !response_url.startsWith("https://queue.fal.run/")) {
      return NextResponse.json({ status: "FAILED", error: "Invalid request" }, { status: 400 });
    }

    // Check result from fal.ai
    const res = await fetch(response_url, {
      headers: { "Authorization": `Key ${FAL_KEY}` },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      if (text.includes("balance") || text.includes("locked")) {
        return NextResponse.json({ status: "FAILED", error: "AI service balance exhausted. Top up at fal.ai." });
      }
      if (res.status === 422 || res.status === 400) {
        return NextResponse.json({ status: "FAILED", error: "Generation failed. Try a different prompt." });
      }
      return NextResponse.json({ status: "IN_QUEUE" });
    }

    let data;
    try { data = await res.json(); } catch {
      return NextResponse.json({ status: "IN_QUEUE" });
    }

    if (data.status === "IN_QUEUE" || data.status === "IN_PROGRESS") {
      return NextResponse.json({ status: data.status, queue_position: data.queue_position });
    }

    if (data.detail) {
      return NextResponse.json({ status: "FAILED", error: data.detail });
    }

    const videoUrl = data?.video?.url;
    const imageUrl = data?.images?.[0]?.url;
    const resultUrl = videoUrl || imageUrl;
    const outputType = videoUrl ? "video" : "image";

    if (!resultUrl) {
      return NextResponse.json({ status: "FAILED", error: "No output in response" });
    }

    // Idempotency: check if we already saved this result
    const { data: existing } = await supabase
      .from("videos")
      .select("id")
      .eq("user_id", user.id)
      .eq("video_url", resultUrl)
      .limit(1);

    if (existing && existing.length > 0) {
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      return NextResponse.json({
        status: "COMPLETED",
        video_url: resultUrl,
        output_type: outputType,
        credits_remaining: profile?.credits ?? 0,
      });
    }

    // Deduct credits (only once)
    const { data: profile } = await supabase
      .from("profiles").select("credits").eq("id", user.id).single();

    const currentCredits = profile?.credits ?? 0;
    const newCredits = Math.max(0, currentCredits - CREDIT_COST);

    const { error: updateErr } = await supabase
      .from("profiles").update({ credits: newCredits }).eq("id", user.id);

    if (updateErr) console.error("Credit update error:", updateErr);

    // Save video
    const { error: insertErr } = await supabase.from("videos").insert({
      user_id: user.id,
      prompt: prompt || "",
      model: model || "kling",
      aspect_ratio: aspect_ratio || "9:16",
      video_url: resultUrl,
    });

    if (insertErr) console.error("Video insert error:", insertErr);

    return NextResponse.json({
      status: "COMPLETED",
      video_url: resultUrl,
      output_type: outputType,
      credits_remaining: newCredits,
    });
  } catch (err) {
    console.error("Status check error:", err);
    return NextResponse.json({ status: "FAILED", error: "Failed to check status" });
  }
}
