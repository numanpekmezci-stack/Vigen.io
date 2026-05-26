export default function VideosPage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">My Videos</h1>
      <p className="text-[#666] text-sm mb-8">Your generated videos</p>

      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#1a1a1a] rounded-xl">
        <span className="text-4xl mb-4">📁</span>
        <h3 className="font-semibold mb-1">No videos yet</h3>
        <p className="text-sm text-[#555] mb-4">Create your first video to get started</p>
        <a
          href="/dashboard/generate"
          className="px-5 py-2.5 bg-[#b8f53d] text-black font-semibold text-sm rounded-lg hover:bg-[#9dd132] transition"
        >
          Generate Video
        </a>
      </div>
    </div>
  );
}
