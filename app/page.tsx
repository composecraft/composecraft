import Link from "next/link";
import {Button} from "@/components/ui/button";
import Demo from "@/components/display/Demo";
import CheckedItem from "@/components/ui/checkItem";

import demogif from "@/assets/demo.gif"
import demoImg from "@/assets/demo-img.png"
import demoEdit from "@/assets/demo-editor.png"
import Image from "next/image";
import {Card, CardContent} from "@/components/ui/card";
import {Album, GraduationCap, PencilLine} from "lucide-react";
import Footer from "@/components/display/footer";
import Nav from "@/components/ui/nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Compose Craft - Docker Compose GUI Builder & Visualizer",
    description: "Create, visualize, and manage Docker Compose files effortlessly. The best free Docker Compose GUI builder and viewer for developers and teams. No credit card required.",
    alternates: {
        canonical: 'https://composecraft.com',
    },
};

export default async function Page() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Compose Craft',
        applicationCategory: 'DeveloperApplication',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        operatingSystem: 'Web',
        description: 'Create, visualize, and manage Docker Compose files effortlessly with Compose Craft. The best free Docker Compose GUI builder and viewer for developers and teams.',
        url: 'https://composecraft.com',
        image: 'https://composecraft.com/og.png',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5',
            ratingCount: '1',
        },
        featureList: [
            'Docker Compose GUI Builder',
            'Visual Docker Compose Editor',
            'YAML to Visual Converter',
            'Drag and Drop Interface',
            'Export Docker Compose Files',
            'Share Compose Configurations',
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <section className="flex flex-col w-screen flex-grow max-w-screen overflow-x-hidden">
                <Nav />
                <section className="grid grid-cols-1 grid-rows-1 bg-dot lg:bg-none bg-contain">
                    <div style={{gridRow: 1, gridColumn: 1, zIndex: 1}}
                         className="px-5 lg:px-10 flex flex-col gap-4 pointer-events-none lg:w-1/2 lg:justify-center">
                        <h1 className="text-5xl font-semibold mt-10 lg:mt-0">
                            <strong className="text-blue-500 font-bold">Effortlessly Create</strong> and <strong
                            className="text-blue-500 font-bold">Visualize</strong> Docker Compose in Seconds
                        </h1>
                        <h2 className="text-xl">
                            Compose craft is the best docker compose tool, that fit the need for individuals, small and
                            mediums teams.
                            No credit card required.
                        </h2>
                        <div className="pointer-events-auto">
                            <Button asChild className="text-xl px-5 py-6 bg-gradient-to-r from-[#1A96F8] via-[#3AA8FF] to-[#62BEFF]">
                                <Link href={"/tryIt/playground"}>
                                    Start now for free
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div style={{gridRow: 1, gridColumn: 1}} className="w-full hidden lg:flex h-[500px]">
                        <Demo />
                    </div>
                    <Image priority className="rounded my-10 mx-auto lg:hidden shadow" src={demogif} alt="demo gif"/>
                </section>
                <section className="grid gap-5 md:grid-cols-3 md:gap-40 px-20 py-20">
                    <Card>
                        <CardContent className="p-6 flex flex-col justify-center items-center">
                            <PencilLine height={40} width={40} className="stroke-blue-500"/>
                            <p>Create</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex flex-col justify-center items-center">
                            <GraduationCap height={40} width={40} className="stroke-orange-500"/>
                            <p>Learn</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex flex-col justify-center items-center">
                            <Album height={40} width={40} className="stroke-green-500"/>
                            <p>Document</p>
                        </CardContent>
                    </Card>
                </section>
                <section className='flex flex-col p-10 items-center gap-5 lg:flex-row lg:justify-around lg:pt-20'>
                    <div>
                    <span className="flex flex-col gap-2">
                        <h3 className="text-2xl lg:text-3xl font-bold">
                            The fastest way to understand new stacks
                        </h3>
                        <span className="pl-5">
                            <CheckedItem text="Bring your own docker compose files"/>
                            <CheckedItem text="Instant process time"/>
                            <CheckedItem text="Drag and re-order components"/>
                        </span>
                    </span>
                    </div>
                    <Image loading="eager" className="w-[800px] lg:w-auto lg:h-[400px] rounded shadow border-[1px]"
                           src={demoImg} alt="demo image"/>
                </section>
                <section
                    className='flex flex-col p-10 items-center gap-5 lg:flex-row-reverse lg:justify-around lg:pt-20'>
                    <div>
                    <span className="flex flex-col gap-2">
                        <h3 className="text-2xl lg:text-3xl font-bold">
                            The easiest way to create docker compose
                        </h3>
                        <span className="pl-5">
                            <CheckedItem text="Export the file"/>
                            <CheckedItem text="Easily edit advanced options"/>
                        </span>
                    </span>
                    </div>
                    <Image loading="lazy" className="lg:w-auto lg:h-[400px] rounded shadow border-[1px]" src={demoEdit}
                           alt="demo image"/>
                </section>
            </section>
            <Footer/>
        </>
    )
}

// @ts-ignore
export const dynamic = "force-dynamic";
