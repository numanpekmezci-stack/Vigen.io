import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#b8f53d] text-black font-bold text-lg grid place-items-center">
          V
        </div>
        <span className="text-xl font-bold">Vigen</span>
      </div>
      <h1 className="text-4xl font-bold text-center max-w-lg leading-tight">
        Create viral videos in{" "}
        <span className="text-[#b8f53d]">Minutes</span>
      </h1>
      <p className="text-[#888] text-center max-w-md">
        Brainrot templates, AI generation with VEO3, SORA2, Kling Video & more.
      </p>
      <div className="flex gap-3 mt-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-[#b8f53d] text-black font-semibold rounded-full hover:bg-[#9dd132] transition"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 border border-[#242424] text-[#888] rounded-full hover:border-[#555] transition"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
