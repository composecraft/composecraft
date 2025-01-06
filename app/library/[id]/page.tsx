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
export async function generateMetadata({
                                           params,
                                       }: {
    params: { id: string }
}): Promise<Metadata> {
    const composeBook = await fetchComposeBookById(params.id) as ComposeBookType

    return {
        title: `Docker compose ${composeBook.title}`,
        description: `Compose craft help you with : ${composeBook.description ? addExtraDots(composeBook.description,100) : "self-host " + composeBook.title}`,
        applicationName: composeBook.title,
        //keywords: flat_tags(composeBook.tags)
    }
}


export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ id: string }>
}){

    const id = (await params).id

    const composeBook = await fetchComposeBookById(id) as ComposeBookType

    return(
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
    )
}