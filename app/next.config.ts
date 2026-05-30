import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@fal-ai/client"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
