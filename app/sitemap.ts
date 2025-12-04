import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://monteverasrl.com.ar'
  const lastModified = new Date()

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/consultor-gps`,
      lastModified,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
  ]
}
