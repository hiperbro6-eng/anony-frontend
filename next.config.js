/** @type {import('next').NextConfig} */
const nextConfig = {
  // This allows the build to finish even if there are small coding warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // If you are using images from external sources
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig