/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force complete rebuild - SAT Prep App with working buttons
  experimental: {
    forceSwcTransforms: true,
  },
  // Clear all caches
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
}

module.exports = nextConfig