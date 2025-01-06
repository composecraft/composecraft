'use client' // Error boundaries must be Client Components

import {useEffect} from 'react'
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <section className="flex h-full flex-grow justify-center items-center">
            <div className='flex flex-col w-full h-full justify-center '>
                <Skeleton className="shadow flex mx-10 h-4/5 rounded-xl justify-center items-center">
                    <div className='flex flex-col gap-3'>
                        {error.message}
                        <Button variant="destructive" onClick={reset}>Reload Page</Button>
                    </div>
                </Skeleton>
            </div>
        </section>
    )
}