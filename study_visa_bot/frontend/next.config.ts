import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/chatboat12',
  assetPrefix: '/chatboat12',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
