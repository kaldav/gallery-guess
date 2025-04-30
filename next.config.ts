import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Assuming your repository name will be "gallery-guess"
  // Change this if your repository has a different name
  basePath: process.env.NODE_ENV === 'production' ? '/gallery-guess' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Disable React Server Components data fetching behavior
  skipTrailingSlashRedirect: true,
  // Fixed assetPrefix to use proper URL format
  assetPrefix: process.env.NODE_ENV === 'production' ? '/gallery-guess' : '',
};

export default nextConfig;
