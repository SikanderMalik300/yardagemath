import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: pre-rendered HTML, no server, no API.
  output: "export",
  trailingSlash: true,
  images: {
    // Static export cannot use the Next image optimizer; images are pre-sized.
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
