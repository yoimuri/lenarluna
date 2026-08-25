import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // The floating dev badge sits exactly where the hero's scroll cue lives,
  // which makes local review harder than it needs to be. Production is
  // unaffected either way -- the badge never ships.
  devIndicators: false,
};

export default nextConfig;
