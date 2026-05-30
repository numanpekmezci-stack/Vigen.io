import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CREDIT_COST = 50;
const FAL_KEY = process.env.FAL_KEY || "";

const TEXT_TO_VIDEO: Record<string, string> = {
  veo3: "fal-ai/kling-video/v2/master/text-to-video",
  sora2: "fal-ai/kling-video/v2/master/text-to-video",
  kling: "fal-ai/kling-video/v2/master/text-to-video",
  wan: "fal-ai/kling-video/v2/master/text-to-video",
};

const IMAGE_TO_VIDEO: Record<string, string> = {
  veo3: "fal-ai/kling-video/v2/master/image-to-video",
  sora2: "fal-ai/kling-video/v2/master/image-to-video",
  kling: "fal-ai/kling-video/v2/master/image-to-video",
  wan: "fal-ai/kling-video/v2/master/image-to-video",
  motion: "fal-ai/kling-video/v2/master/image-to-video",
};

const IMAGE_GEN = "fal-ai/nano-banana-pro";

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
      return NextResponse.json({ error: "Not logged in." }, { status: 401 });
    }

    if (!FAL_KEY) {
      return NextResponse.json({ error: "AI service not configured. Set FAL_KEY." }, { status: 503 });
    }

    const { prompt, model, aspect_ratio, image_url } = await request.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    if (model === "motion" && !image_url) {
      return NextResponse.json({ error: "Motion Control requires a reference image." }, { status: 400 });
    }

    let { data: profile, error: profileError } = await supabase
      .from("profiles").select("credits").eq("id", user.id).single();

    if (profileError || !profile) {
      await supabase.from("profiles").insert({ id: user.id, credits: 500 });
      profile = { credits: 500 };
    }

    const currentCredits = profile.credits ?? 0;
    if (currentCredits < CREDIT_COST) {
      return NextResponse.json({ error: `Not enough credits. Need ${CREDIT_COST}, have ${currentCredits}.` }, { status: 402 });
    }

    const isNano = model === "nano";
    const useImage = !!image_url;

    let endpointId: string;
    const input: Record<string, unknown> = { prompt };

    if (isNano) {
      endpointId = IMAGE_GEN;
      input.num_images = 1;
      input.resolution = "1K";
    } else {
      endpointId = useImage
        ? (IMAGE_TO_VIDEO[model] || IMAGE_TO_VIDEO.kling)
        : (TEXT_TO_VIDEO[model] || TEXT_TO_VIDEO.kling);
      input.duration = "5";
      input.aspect_ratio = aspect_ratio || "9:16";
      if (useImage) input.start_image_url = image_url;
    }

    // Submit to queue (non-blocking)
    const queueRes = await fetch(`https://queue.fal.run/${endpointId}`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const queueData = await queueRes.json();

    if (!queueRes.ok) {
      const msg = queueData?.detail || queueData?.message || "Failed to start generation";
      if (msg.includes("balance") || msg.includes("locked")) {
        return NextResponse.json({ error: "AI service balance exhausted. Top up at fal.ai." }, { status: 503 });
      }
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    return NextResponse.json({
      request_id: queueData.request_id,
      status_url: queueData.status_url,
      response_url: queueData.response_url,
      user_id: user.id,
      credits: currentCredits,
      output_type: isNano ? "image" : "video",
    });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Generation failed" }, { status: 500 });
  }
}
