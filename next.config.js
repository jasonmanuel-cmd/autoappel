/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          ...(process.env.NODE_ENV === 'production' ? [{ key: 'X-Frame-Options', value: 'DENY' }] : []),
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=()',
          },
          ...(process.env.NODE_ENV === 'production' ? [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains',
            },
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://connect.facebook.net https://analytics.tiktok.com https://static.cloudflareinsights.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https://challenges.cloudflare.com;",
            },
          ] : []),
        ],
      },
    ]
  },
}
module.exports = nextConfig
