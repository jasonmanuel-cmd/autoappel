import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://AppealMyTickets.com'
  const now = new Date().toISOString()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/intake`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/track`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/countdown`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/confirmation`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.1 },
    { url: `${base}/payment/service`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/forgot-password`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/reset-password`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/verify-email`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
