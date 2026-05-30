import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CREDIT_COST = 50;
const FAL_KEY = process.env.FAL_KEY || "";

const MODELS: Record<string, {
  text: string;
  image?: string;
  motion?: string;
  type: "video" | "image";
  inputKey?: string;
}> = {
  veo3: {
    text: "fal-ai/veo3",
    image: "fal-ai/veo3.1/image-to-video",
    type: "video",
    inputKey: "image_url",
  },
  sora2: {
    text: "fal-ai/sora-2/text-to-video",
    image: "fal-ai/sora-2/image-to-video",
    type: "video",
    inputKey: "image_url",
  },
  kling: {
    text: "fal-ai/kling-video/v2/master/text-to-video",
    image: "fal-ai/kling-video/v2/master/image-to-video",
    type: "video",
    inputKey: "start_image_url",
  },
  wan: {
    text: "fal-ai/wan/v2.7/text-to-video",
    image: "fal-ai/wan/v2.7/image-to-video",
    type: "video",
    inputKey: "image_url",
  },
  nano: {
    text: "fal-ai/nano-banana-pro",
    type: "image",
  },
  motion: {
    text: "fal-ai/kling-video/v3/pro/motion-control",
    motion: "fal-ai/kling-video/v3/pro/motion-control",
    type: "video",
  },
};

export async function POST(request: Request) {
  try {
    if (!FAL_KEY) {
      return NextResponse.json({ error: "AI service not configured. Set FAL_KEY." }, { status: 503 });
    }

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

    const { prompt, model, aspect_ratio, image_url, video_url, character_orientation } = await request.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const modelConfig = MODELS[model];
    if (!modelConfig) {
      return NextResponse.json({ error: `Unknown model: ${model}` }, { status: 400 });
    }

    // Motion Control needs image_url + video_url
    if (model === "motion" && !image_url) {
      return NextResponse.json({ error: "Motion Control requires a reference image." }, { status: 400 });
    }

    // Credits check
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

    // Build fal.ai request
    let endpointId: string;
    const input: Record<string, unknown> = { prompt };

    if (model === "motion") {
      // Motion Control: image + video + orientation
      endpointId = modelConfig.motion!;
      input.image_url = image_url;
      if (video_url) input.video_url = video_url;
      input.character_orientation = character_orientation || "video";
    } else if (model === "nano") {
      // Nano Banana: image generation
      endpointId = modelConfig.text;
      input.num_images = 1;
      input.resolution = "1K";
    } else if (image_url) {
      // Image-to-video for other models
      endpointId = modelConfig.image || modelConfig.text;
      input[modelConfig.inputKey || "image_url"] = image_url;
      input.duration = "5";
      input.aspect_ratio = aspect_ratio || "9:16";
    } else {
      // Text-to-video
      endpointId = modelConfig.text;
      input.duration = model === "veo3" ? "8s" : "5";
      input.aspect_ratio = aspect_ratio || "9:16";
    }

    // Submit to fal queue
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
      output_type: modelConfig.type,
    });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Generation failed" }, { status: 500 });
  }
}
