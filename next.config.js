/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force all pages to be dynamic (no static generation)
  experimental: {
    // This prevents static generation and forces everything to run at runtime
    isrMemoryCacheSize: 0,
  },
  // Disable static optimization
  staticPageGenerationTimeout: 0,
}

module.exports = nextConfig