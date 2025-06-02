/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google OAuth profile pictures
  },
  typescript: {
    // Don't fail builds on TS errors during development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig; 