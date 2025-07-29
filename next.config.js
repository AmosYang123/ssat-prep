/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force fresh deployment - SAT Prep App with working buttons
  experimental: {
    // This forces Vercel to rebuild
  }
}

module.exports = nextConfig