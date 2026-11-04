/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve images as-is from /public: the Vercel project runs in services mode,
    // where /_next/image isn't routed, so optimized URLs 404.
    unoptimized: true,
  },
};

export default nextConfig;
