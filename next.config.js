/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true, // ⚡ Enables instrumentation.ts in Next.js 14
  },
}

module.exports = nextConfig


