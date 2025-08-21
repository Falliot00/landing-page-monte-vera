import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://monteverasrl.com.ar/sitemap.xml', // Reemplaza con tu dominio real
    host: 'https://monteverasrl.com.ar/', // Reemplaza con tu dominio real
  }
}