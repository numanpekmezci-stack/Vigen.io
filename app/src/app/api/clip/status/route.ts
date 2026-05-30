import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { job_id } = await request.json();

    if (job_id) {
      const { data } = await supabase
        .from("clip_jobs")
        .select("*")
        .eq("id", job_id)
        .eq("user_id", user.id)
        .single();
      return NextResponse.json({ job: data });
    }

    const { data: jobs } = await supabase
      .from("clip_jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    return NextResponse.json({ jobs: jobs || [] });
  } catch (err) {
    console.error("Status error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
