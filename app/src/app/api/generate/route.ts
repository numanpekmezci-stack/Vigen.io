import { createServerClient } from "@supabase/ssr";
import { fal } from "@fal-ai/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CREDIT_COST = 50;

fal.config({ credentials: process.env.FAL_KEY! });

const TEXT_TO_VIDEO: Record<string, string> = {
  veo3: "fal-ai/kling-video/v2/master/text-to-video",
  sora2: "fal-ai/kling-video/v2/master/text-to-video",
  kling: "fal-ai/kling-video/v2/master/text-to-video",
  wan: "fal-ai/kling-video/v2/master/text-to-video",
  nano: "fal-ai/kling-video/v2/master/text-to-video",
};

const IMAGE_TO_VIDEO: Record<string, string> = {
  veo3: "fal-ai/kling-video/v2/master/image-to-video",
  sora2: "fal-ai/kling-video/v2/master/image-to-video",
  kling: "fal-ai/kling-video/v2/master/image-to-video",
  wan: "fal-ai/kling-video/v2/master/image-to-video",
  nano: "fal-ai/kling-video/v2/master/image-to-video",
  motion: "fal-ai/kling-video/v2/master/image-to-video",
};

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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not logged in. Please log in and try again." }, { status: 401 });
    }

    const { prompt, model, aspect_ratio, image_url } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (model === "motion" && !image_url) {
      return NextResponse.json({ error: "Motion Control requires a reference image. Please upload one." }, { status: 400 });
    }

    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      await supabase.from("profiles").insert({ id: user.id, credits: 500 });
      profile = { credits: 500 };
    }

    const currentCredits = profile.credits ?? 0;
    if (currentCredits < CREDIT_COST) {
      return NextResponse.json({ error: `Not enough credits. Need ${CREDIT_COST}, have ${currentCredits}.` }, { status: 402 });
    }

    const useImageToVideo = !!image_url;
    const endpointId = useImageToVideo
      ? (IMAGE_TO_VIDEO[model] || IMAGE_TO_VIDEO.kling)
      : (TEXT_TO_VIDEO[model] || TEXT_TO_VIDEO.kling);

    const input: Record<string, unknown> = {
      prompt,
      duration: "5",
      aspect_ratio: aspect_ratio || "9:16",
    };

    if (useImageToVideo) {
      input.start_image_url = image_url;
    }

    let result;
    try {
      result = await fal.subscribe(endpointId, { input });
    } catch (falErr) {
      const msg = falErr instanceof Error ? falErr.message : String(falErr);
      if (msg.includes("balance") || msg.includes("locked")) {
        return NextResponse.json({ error: "AI service balance exhausted. Please top up at fal.ai." }, { status: 503 });
      }
      return NextResponse.json({ error: `AI generation failed: ${msg}` }, { status: 502 });
    }

    const videoUrl = (result.data as { video?: { url?: string } })?.video?.url;
    if (!videoUrl) {
      return NextResponse.json({ error: "No video returned. Please try again." }, { status: 500 });
    }

    const newCredits = currentCredits - CREDIT_COST;
    await supabase.from("profiles").update({ credits: newCredits }).eq("id", user.id);

    await supabase.from("videos").insert({
      user_id: user.id,
      prompt,
      model: model || "kling",
      aspect_ratio: aspect_ratio || "9:16",
      video_url: videoUrl,
    });

    return NextResponse.json({ video_url: videoUrl, credits_remaining: newCredits });
  } catch (err) {
    console.error("Generate error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
