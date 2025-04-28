import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Assuming your repository name will be "gallery-guess"
  // Change this if your repository has a different name
  basePath: process.env.NODE_ENV === 'production' ? '/gallery-guess' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
