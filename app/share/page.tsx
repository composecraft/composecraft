import AsyncReadOnlyPlayground from "@/components/playground/asyncReadonlyPlayground";
import {Suspense} from "react";
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";

type SP = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page({searchParams}:{searchParams:SP}){

    const sp = await searchParams
    const id = sp.id
    const name = sp.name

    return(
        <section className="flex h-full flex-grow justify-center items-center">
            <div className='flex flex-col w-full h-full'>
                <span className="flex flex-row items-center justify-between p-10">
                    {name &&
                        <p className='text-2xl font-bold'>
                            {name}
                        </p>}
                    <p className='text-lg'>Created with <Link className="underline font-bold" href={"/"}>Compose Craft ❤️</Link></p>
                </span>
                <Suspense fallback={<Skeleton className="shadow flex mx-10 h-4/5 rounded-xl justify-center items-center" > Loading</Skeleton>}>
                    <AsyncReadOnlyPlayground shareId={id?.toString() || ""} options={{
                        className: "shadow flex mx-10 h-4/5 rounded-xl border-2 border-slate-100"
                    }} />
                </Suspense>
            </div>
        </section>
    )
}