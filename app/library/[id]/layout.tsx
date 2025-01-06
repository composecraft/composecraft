"use server"

import {ReactElement} from "react";
import Footer from "@/components/display/footer";

export default async function Layout({children}:{children:ReactElement}){


    return(
        <div>
            {children}
            <Footer />
        </div>
    )
}