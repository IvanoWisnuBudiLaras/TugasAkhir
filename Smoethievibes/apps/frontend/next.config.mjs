/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // @performa Docker/Fly.io compatibility
  // @performa Image optimization untuk CDN dan lokal
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql',
  },
  // @performa Production optimization (swcMinify is default in Next.js 15)
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
  },
  compress: true,
}
export default nextConfig;