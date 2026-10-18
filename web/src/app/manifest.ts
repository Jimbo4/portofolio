import type { MetadataRoute } from "next";
import { profile } from "@/lib/config";

/** Web app manifest: name, colors and icons when the site is added to a phone's home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.name,
    short_name: "JM",
    description: profile.description,
    start_url: "/",
    display: "browser",
    background_color: "#f5f2ee",
    theme_color: "#f5f2ee",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
