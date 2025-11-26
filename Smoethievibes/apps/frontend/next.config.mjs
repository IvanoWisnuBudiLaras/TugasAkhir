/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Untuk Docker/Fly.io
  images: {
    unoptimized: true, // Disable image optimization untuk hemat resource
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql',
  },
  experimental: {
    // Hemat memory di production
    workerThreads: false,
    cpus: 1,
  }
}
export default nextConfig;