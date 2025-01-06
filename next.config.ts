import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', //static site generation
  //trailingSlash: true,
  images: {
    unoptimized: true,
}
};

export default nextConfig;
