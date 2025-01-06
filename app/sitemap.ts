import type { MetadataRoute } from 'next'
import {fetchComposeBooks} from "@/actions/directus";
import {ComposeBookType} from "@/app/library/composeBook";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const initalFetch = await fetchComposeBooks({
        limit: 100
    })

    return [
        ...initalFetch.data.map((c:ComposeBookType)=>({
            url : `https://composecraft.com/library/${c.id}`,
            lastModified: c.date_updated,
            priority: 0.5
        })),
        {
            url: 'https://composecraft.com',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://composecraft.com/docs',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://composecraft.com/library',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ]
}

export const dynamic = "force-dynamic";