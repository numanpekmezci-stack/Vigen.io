import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const FAL_KEY = process.env.FAL_KEY!;
const CREDIT_COST = 50;

export async function POST(request: Request) {
  try {
    const { response_url, user_id, prompt, model, aspect_ratio } = await request.json();

    // Check result from fal.ai
    const res = await fetch(response_url, {
      headers: { "Authorization": `Key ${FAL_KEY}` },
    });

    const data = await res.json();

    // Still in queue or processing
    if (data.status === "IN_QUEUE" || data.status === "IN_PROGRESS") {
      return NextResponse.json({ status: data.status, queue_position: data.queue_position });
    }

    // Error
    if (data.detail) {
      return NextResponse.json({ status: "FAILED", error: data.detail });
    }

    // Got result
    const videoUrl = data?.video?.url;
    if (!videoUrl) {
      return NextResponse.json({ status: "FAILED", error: "No video in response" });
    }

    // Deduct credits + save video
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

    const { data: profile } = await supabase
      .from("profiles").select("credits").eq("id", user_id).single();

    const currentCredits = profile?.credits ?? 0;
    const newCredits = Math.max(0, currentCredits - CREDIT_COST);

    await supabase.from("profiles").update({ credits: newCredits }).eq("id", user_id);

    await supabase.from("videos").insert({
      user_id,
      prompt: prompt || "",
      model: model || "kling",
      aspect_ratio: aspect_ratio || "9:16",
      video_url: videoUrl,
    });

    return NextResponse.json({
      status: "COMPLETED",
      video_url: videoUrl,
      credits_remaining: newCredits,
    });
  } catch (err) {
    console.error("Status check error:", err);
    return NextResponse.json({ status: "FAILED", error: "Failed to check status" });
  }
}
