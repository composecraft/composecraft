"use server"

import {ReactNode} from "react";
import Footer from "@/components/display/footer";

export default async function Layout({children}:{children:ReactNode}){
    return(
        <div>
            {children}
            <Footer />
        </div>
    )
}