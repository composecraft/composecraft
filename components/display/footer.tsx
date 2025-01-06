"use server"

import Link from "next/link";

export default async function Footer(){

    if(process.env.CORE_ONLY){
        return <></>
    }

    return(
        <footer
            className="bg-slate-800 text-white p-10 grid grid-rows-3 md:grid-rows-1 md:grid-cols-3 gap-10 md:gap-20">
            <div>
                <p className="text-xl font-bold">Compose craft</p>
                <p>Compose craft est un service de Entre Compétents SARL</p>
            </div>
            <div className="flex flex-col underline">
                <Link href={"/"}>Product</Link>
                <Link href={"/cgu.pdf"}>CGU</Link>
            </div>
            <div className="flex flex-col">
                <p className="underline text-xl">Contact</p>
                <p>contact@entrecompetents.fr</p>
            </div>
        </footer>
    )
}