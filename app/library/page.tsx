import SearchInput from "@/components/ui/searchInput";
import {Suspense} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import SearchResult from "@/app/library/searchResult";
import {fetchComposeBooks} from "@/actions/directus";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Docker Compose Library - Pre-built Templates & Examples",
    description: "Browse our library of ready-to-use Docker Compose templates and configurations. Find examples for popular services, databases, and complete application stacks.",
    alternates: {
        canonical: 'https://composecraft.com/library',
    },
    openGraph: {
        title: 'Docker Compose Library - Pre-built Templates & Examples',
        description: 'Browse our library of ready-to-use Docker Compose templates and configurations.',
        url: 'https://composecraft.com/library',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Docker Compose Library - Pre-built Templates & Examples',
        description: 'Browse our library of ready-to-use Docker Compose templates and configurations.',
    },
};

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: Promise<{ [key: string]: string }>
}){

    const res = await fetchComposeBooks({
        limit:10,
        search: (await searchParams).search
    })

    return (
        <section>
            <div className="flex items-center justify-center flex-grow md:mx-20">
                <SearchInput placeholder="Search..." className="mx-10 md:my-10 text-xl rounded-full md:px-5 md:py-5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-10 mx-5 md:mx-20">
                <Suspense key={(await searchParams).search} fallback={Array.from({ length: 9 }).map((_, index) =>
                    <Skeleton key={index} className="w-full h-48" />
                )}>
                    <SearchResult res={res} />
                </Suspense>
            </div>
        </section>
    )
}
