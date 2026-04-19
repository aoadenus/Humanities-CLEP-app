import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.1.194"],
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
