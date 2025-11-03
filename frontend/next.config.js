/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Konfigurasi untuk Railway
  output: 'standalone',
  // Disable CSS optimization yang menyebabkan error lightningcss
  experimental: {
    forceSwcTransforms: true,
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Port configuration untuk Railway
  port: process.env.PORT || 3000,
  hostname: '0.0.0.0',
}

module.exports = nextConfig