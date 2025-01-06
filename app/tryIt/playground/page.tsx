"use client"

import PlaygroundContent from "@/components/playground/playGroundContent";
import {Suspense} from "react";

export default function Page(){

    return(
        <Suspense fallback={<div>Loading ...</div>}>
            <PlaygroundContent inviteMode={true} />
        </Suspense>
    )
}