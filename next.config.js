/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['192.168.219.55'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.219.55',
        port: '5001',
        pathname: '/**',
      },
    ],
  },
  env: {
    NAS_SERVER_URL: process.env.NAS_SERVER_URL || 'http://192.168.219.55:5001',
  },
}

module.exports = nextConfig

