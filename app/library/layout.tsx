"use server"

import {ReactElement} from "react";
import Nav from "@/components/ui/nav";

export default async function Layout({children}:{children:ReactElement}){


    return(
        <section>
            <Nav />
            {children}
        </section>
    )
}