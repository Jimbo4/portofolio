import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    // Requests that ask for Markdown (AI agents) get the plain text twin of a page; browsers never send it
    const wantsMarkdown = [{ type: "header" as const, key: "accept", value: ".*text/markdown.*" }];
    return {
      beforeFiles: [
        { source: "/case-studies/:slug([a-z0-9-]+)\\.md", destination: "/md/case-studies/:slug" },
        { source: "/case-studies/:slug([a-z0-9-]+)", has: wantsMarkdown, destination: "/md/case-studies/:slug" },
        { source: "/", has: wantsMarkdown, destination: "/llms.txt" },
        { source: "/case-studies", has: wantsMarkdown, destination: "/llms.txt" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
