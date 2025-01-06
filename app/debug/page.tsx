"use server"

import Footer from "@/components/display/footer";
import Debug from "./debug";

export default async function Page(){

    return(
        <>
            <Debug />
            <Footer />
        </>
    )
}

