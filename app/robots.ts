import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
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
