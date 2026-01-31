import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://priceghost.app';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/products/', '/alerts/', '/settings/', '/analytics/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
