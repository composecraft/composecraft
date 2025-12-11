import {fetchComposeBookById} from "@/actions/directus";
import {ComposeBookType, ItemList} from "@/app/library/composeBook";
import {Metadata} from "next";
import {addExtraDots} from "@/lib/utils";
import { MDXRemote } from 'next-mdx-remote/rsc'
import AsyncReadOnlyPlayground from "@/components/playground/asyncReadonlyPlayground";
import {Button} from "@/components/ui/button";
import {FileDown} from "lucide-react";
import Link from "next/link";

function flat_tags(input:ItemList):string[]{
    return input.map(it=>it?.item?.name)
}

// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata(
    props: {
        params: Promise<{ id: string }>
    }
): Promise<Metadata> {
    const params = await props.params;
    const composeBook = await fetchComposeBookById(params.id) as ComposeBookType

    const title = `${composeBook.title} - Docker Compose Template`;
    const description = composeBook.description 
        ? addExtraDots(composeBook.description, 155) 
        : `Learn how to self-host ${composeBook.title} with this ready-to-use Docker Compose template. Free to download and customize.`;

    return {
        title: title,
        description: description,
        keywords: flat_tags(composeBook.tags),
        alternates: {
            canonical: `https://composecraft.com/library/${params.id}`,
        },
        openGraph: {
            title: title,
            description: description,
            url: `https://composecraft.com/library/${params.id}`,
            type: 'article',
            publishedTime: composeBook.date_created,
            modifiedTime: composeBook.date_updated,
            tags: flat_tags(composeBook.tags),
            images: [
                {
                    url: '/og.png',
                    width: 1200,
                    height: 627,
                    alt: `${composeBook.title} Docker Compose Template`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: ['/og.png'],
        },
    }
}


export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ id: string }>
}){

    const id = (await params).id

    const composeBook = await fetchComposeBookById(id) as ComposeBookType

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: `${composeBook.title} - Docker Compose Template`,
        description: composeBook.description || `Learn how to self-host ${composeBook.title} with Docker Compose`,
        image: 'https://composecraft.com/og.png',
        datePublished: composeBook.date_created,
        dateModified: composeBook.date_updated,
        author: {
            '@type': 'Organization',
            name: 'Compose Craft',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Compose Craft',
            logo: {
                '@type': 'ImageObject',
                url: 'https://composecraft.com/og.png',
            },
        },
        keywords: flat_tags(composeBook.tags).join(', '),
    };

    return(
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="px-2 md:px-10 md:mt-10 flex flex-col gap-5">
            <p className="text-2xl font-black">
                {composeBook.title}
            </p>
            <div className='flex flex-row gap-2'>
                {flat_tags(composeBook.tags).splice(0, 3).map((tag) => (
                    <div key={tag} className="text-sm text-violet-500 p-1 px-2 bg-slate-100 rounded">
                        {tag}
                    </div>
                ))}
            </div>
            <p className="text-xl">
                {composeBook.description}
            </p>
            <div className="flex flex-col md:flex-row gap-10 mt-4">
                <div className="flex flex-col gap-5 md:w-3/5">
                    <AsyncReadOnlyPlayground shareId={composeBook.shareId} options={{
                        className: "shadow flex mx-2 h-48 rounded border-2 border-slate-100 md:h-96"
                    }}/>
                    <Link className="hidden md:flex" href={`/api/compose?id=${composeBook.shareId}`}>
                        <Button className="flex flex-row gap-2"><FileDown height={20}/>Download</Button>
                    </Link>
                </div>
                <div className="md:w-2/5
                    prose
                ">
                    <MDXRemote source={composeBook.content}/>
                </div>
            </div>
        </div>
        </>
    )
}
