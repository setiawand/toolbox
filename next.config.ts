import type { NextConfig } from "next";

const config: NextConfig = {
  // Static site: every tool runs in the browser, so no server is needed.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default config;
