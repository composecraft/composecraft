"use client"

import {ReactElement} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Typewriter} from "react-simple-typewriter";

export default function Debug(): ReactElement<any> {
    "use client"

    return (
        <section className="min-h-screen">
            <div className="flex flex-col gap-3 w-full justify-center items-center pb-5 lg:pb-10 pt-20">
                <h1 className="text-2xl lg:text-5xl font-bold">Debug docker visually</h1>
                <h2 className="text-lg lg:text-xl">Debugging docker have never been so easy</h2>
                <Link href={"https://github.com/LucasSovre/dockscribe"}>
                    <Button>Start debugging</Button>
                </Link>
            </div>
            <div className="w-full flex justify-center items-center">
                <div className="flex flex-col gap-3 bg-slate-200 text-slate-900 w-5/6 lg:w-1/2 max-w-[700px] rounded p-4">
                    <span className="flex flex-row gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="w-3 h-3 rounded-full bg-orange-300"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    </span>
                    <p><strong className="text-blue-500">$ dockscribe</strong> <Typewriter
                        words={["describe", "describe --filename ./docker-compose.yaml", "describe --filename https://whathever.com/docker-compose.yaml"]}
                        loop={false}
                        cursor={true}
                    /></p>
                </div>
            </div>
        </section>
    )
}
