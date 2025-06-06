/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google OAuth profile pictures
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/assets/**',
      },
    ],
  },
  typescript: {
    // Don't fail builds on TS errors during development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg)$/i,
      type: 'asset/resource'
    });
    return config;
  }
};

module.exports = nextConfig; 