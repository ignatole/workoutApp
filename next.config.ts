import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
    cacheComponents: true,
  },
};

export default nextConfig;
