"use client"

import {Button} from "@/components/ui/button";
import {IterationCw} from "lucide-react";

export default function ErrorComponent({
                                           error,
                                           reset,
                                       }: {
    error: Error & { digest?: string }
    reset: () => void
}){
    return(
        <div className="flex flex-col justify-center items-center">
            {error.message}
            <Button onClick={reset} className="flex gap-2"><IterationCw height={15} /> Retry</Button>
        </div>
    )
}