import { MetadataRoute } from 'next'
import { isCoreOnly } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
    // In CORE_ONLY mode, block all search engine indexing
    if (isCoreOnly()) {
        return {
            rules: [
                {
                    userAgent: '*',
                    disallow: '/',
                },
            ],
        }
    }

    // Production mode: allow indexing with proper restrictions
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/debug/',
                    '/forgotPassword/',
                    '/login/',
                    '/signin/',
                ],
            },
        ],
        sitemap: 'https://composecraft.com/sitemap.xml',
    }
}
