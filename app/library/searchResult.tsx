"use server"

import ComposeBook, {ComposeBookType} from "@/app/library/composeBook";

export default async function SearchResult({res}:{res:any}){

    return(
        <>
            {res.data.map((item:ComposeBookType)=><ComposeBook key={item.id} {...item} />)}
        </>
    )
}