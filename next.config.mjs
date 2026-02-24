/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    scrollRestoration: true,
  },
  // Compression
  compress: true,
  poweredByHeader: false,
  // Eliminate redirect chains - go directly to canonical HTTPS non-www URL
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.vibe.rehab' }],
        destination: 'https://vibe.rehab/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
