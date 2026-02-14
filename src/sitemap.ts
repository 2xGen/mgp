
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mygoprofile.com';

  const staticRoutes = [
    '/',
    '/why-mygoprofile',
    '/pricing',
    '/resources',
    '/terms',
    '/privacy',
    '/cookies'
  ];

  const resourceRoutes = [
    '/resources/ai-and-local-seo',
    '/resources/google-business-profile-optimization-2025',
    '/resources/does-responding-to-google-reviews-boost-seo',
    '/resources/top-google-business-profile-mistakes',
    '/resources/multi-location-seo-management',
    '/resources/how-to-optimize-for-near-me-searches',
    '/resources/best-time-to-post-on-google-business-profile',
    '/resources/how-often-to-update-photos-on-gbp',
    '/resources/how-to-pick-google-business-categories',
    '/resources/how-to-use-utm-tracking-for-gbp'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith('/resources') ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));

  const resourceEntries: MetadataRoute.Sitemap = resourceRoutes.map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.9,
  }));

  return [
    ...sitemapEntries,
    ...resourceEntries
  ]
}
