import { createClient } from "@/lib/supabase-server";
import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";

const CREDIT_COST = 50;

fal.config({ credentials: process.env.FAL_KEY! });

const MODEL_MAP: Record<string, string> = {
  veo3: "fal-ai/kling-video/v2/master/text-to-video",
  sora2: "fal-ai/kling-video/v2/master/text-to-video",
  kling: "fal-ai/kling-video/v2/master/text-to-video",
  wan: "fal-ai/kling-video/v2/master/text-to-video",
  nano: "fal-ai/kling-video/v2/master/text-to-video",
  motion: "fal-ai/kling-video/v2/master/text-to-video",
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, model, aspect_ratio } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (!profile) {
      await supabase.from("profiles").insert({ id: user.id, credits: 500 });
      profile = { credits: 500 };
    }

    const currentCredits = profile?.credits ?? 0;

    if (currentCredits < CREDIT_COST) {
      return NextResponse.json(
        { error: `Not enough credits. You need ${CREDIT_COST}, you have ${currentCredits}.` },
        { status: 402 }
      );
    }

    const endpointId = MODEL_MAP[model] || MODEL_MAP.kling;

    const result = await fal.subscribe(endpointId, {
      input: {
        prompt,
        duration: "5",
        aspect_ratio: aspect_ratio || "9:16",
      },
    });

    const videoUrl = (result.data as { video?: { url?: string } })?.video?.url;

    if (!videoUrl) {
      return NextResponse.json({ error: "No video returned from AI model" }, { status: 500 });
    }

    const newCredits = currentCredits - CREDIT_COST;
    await supabase
      .from("profiles")
      .upsert({ id: user.id, credits: newCredits }, { onConflict: "id" });

    await supabase.from("videos").insert({
      user_id: user.id,
      prompt,
      model: model || "kling",
      aspect_ratio: aspect_ratio || "9:16",
      video_url: videoUrl,
    });

    return NextResponse.json({
      video_url: videoUrl,
      credits_remaining: newCredits,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
