"use server"

import SearchInput from "@/components/ui/searchInput";
import {Suspense} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import SearchResult from "@/app/library/searchResult";
import {fetchComposeBooks} from "@/actions/directus";

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