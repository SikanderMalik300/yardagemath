import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YardageMath – Free Construction & Yard Calculators",
    short_name: "YardageMath",
    description:
      "Free, accurate calculators for concrete, blocks, gravel, topsoil, mulch, gutters and lawn care.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8f6",
    theme_color: "#236b4b",
    icons: [
      { src: "/icon-192.png", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
    ],
  };
}
