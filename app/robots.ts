import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/payment/form', '/demo-payment', '/test-dashboard', '/ambassadors', '/treasury', '/qa', '/red-vault', '/control-panel', '/forgot-password', '/reset-password', '/verify-email'],
      },
    ],
    sitemap: 'https://autoappel1.vercel.app/sitemap.xml',
  }
}
