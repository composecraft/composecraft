"use server"

import {ReactNode} from "react";
import Nav from "@/components/ui/nav";

export default async function Layout({children}:{children:ReactNode}){

    return(
        <section>
            <Nav />
            {children}
        </section>
    )
}