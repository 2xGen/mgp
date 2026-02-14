
import { MetadataRoute } from 'next'

/** Sitemap lastModified date (Feb 4, 2026). Update when you regenerate the sitemap. */
const sitemapDate = new Date('2026-02-04');

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
    '/resources/google-business-profile-optimization',
    '/resources/does-responding-to-google-reviews-boost-seo',
    '/resources/top-google-business-profile-mistakes',
    '/resources/multi-location-seo-management',
    '/resources/how-to-optimize-for-near-me-searches',
    '/resources/best-time-to-post-on-google-business-profile',
    '/resources/how-often-to-update-photos-on-gbp',
    '/resources/how-to-pick-google-business-categories',
    '/resources/how-to-use-utm-tracking-for-gbp',
    '/resources/7-ways-ai-can-improve-gbp-rankings',
    '/resources/how-to-automate-gbp-review-replies-with-ai',
    '/resources/comparing-chatgpt-gemini-mygoprofile',
    '/resources/ai-powered-content-ideas-for-google-posts',
    '/resources/future-of-local-search-with-ai-overviews'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: sitemapDate,
    changeFrequency: path.startsWith('/resources') ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));

  const resourceEntries: MetadataRoute.Sitemap = resourceRoutes.map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: sitemapDate,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [
    ...sitemapEntries,
    ...resourceEntries,
     {
      url: `${baseUrl}/2xgen`,
      lastModified: sitemapDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
