import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site-config'
import { getAllRoasts } from '@/lib/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: siteConfig.url,
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${siteConfig.url}/roasts`,
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ]

    const roasts = getAllRoasts()
    const roastRoutes: MetadataRoute.Sitemap = roasts.map((roast) => ({
        url: `${siteConfig.url}/roasts/${roast.id}`,
        lastModified: roast.roastDate || new Date().toISOString().split('T')[0],
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    return [...staticRoutes, ...roastRoutes]
}
