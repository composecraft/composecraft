import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // CORE_ONLY mode: return empty sitemap (no SEO indexing needed)
    return [];
}

export const dynamic = "force-dynamic";
