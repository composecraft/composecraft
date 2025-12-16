import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    // CORE_ONLY mode: block all search engine indexing
    return {
        rules: [
            {
                userAgent: '*',
                disallow: '/',
            },
        ],
    }
}
