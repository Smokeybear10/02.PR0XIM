import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://dr4ft.vercel.app'

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/analyzer`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/builder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
