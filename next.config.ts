import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/app/login", destination: "/login", permanent: true },
      {
        source: "/app/companies/:path*",
        destination: "/companies/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
