"use client"

import {ReactElement} from "react";
import Nav from "@/components/ui/nav";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Typewriter} from "react-simple-typewriter";
import Image from "next/image";
import gif from "@/assets/gif-min.gif";

export default function Debug(): ReactElement<any> {
    "use client"

    return (
        <section>
            <Nav/>
            <div className="flex flex-col gap-3 w-full justify-center items-center pb-5 lg:pb-10 pt-20">
                <h1 className="text-2xl lg:text-5xl font-bold">Debug docker visually</h1>
                <h2 className="text-lg lg:text-xl">Debugging docker have never been so easy</h2>
                <Link href={"https://github.com/LucasSovre/dockscribe"}>
                    <Button>Start debugging</Button>
                </Link>
            </div>
            <div className="w-full flex justify-center items-center">
                <div className="flex flex-col gap-3 bg-slate-200 text-slate-900 w-5/6 lg:w-1/2 max-w-[700px]  rounded p-4">
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
            <span className="flex h-20 w-full bg-gradient-to-b from-white to-slate-400 mt-40"></span>
            <div className="flex w-full justify-center items-center text-2xl font-bold bg-slate-400 text-white py-20">
                <div>
                    <span className="flex">
                        <p className="w-1/2 text-center">Before dockscribe</p>
                        <p className="w-1/2 text-center">Now</p>
                    </span>
                    <Image className="rounded-lg" src={gif} alt="demo gif" />
                </div>
            </div>
        </section>
    )
}