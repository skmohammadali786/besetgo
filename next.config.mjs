/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    // 👇 force Netlify + Next.js to transpile ai-workflows properly
    transpilePackages: ['ai-workflows'],
  },
};

export default nextConfig;
