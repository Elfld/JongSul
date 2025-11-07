import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 모든 호스트 허용 (테스트용)
      },
      {
        protocol: 'http',
        hostname: '**', // 모든 호스트 허용 (테스트용)
      },
    ],
  },
};

export default nextConfig;
