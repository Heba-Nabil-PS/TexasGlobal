/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve images as-is from /public; skip the Next.js image optimizer.
    unoptimized: true,
  },
};

export default nextConfig;
