"use server"

import {getAllFeatures} from "@/actions/featuresActions";
import Feature from "@/components/ui/feature";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Megaphone} from "lucide-react";

export default async function Page(){

    const {features, liked} = await getAllFeatures()

    return(
        <section className="flex flex-col">
            <p className="text-2xl font-bold mb-10">Upcoming features :</p>
            <div className='grid grid-cols-2 gap-5 mb-5'>
                {features.map((f)=>(
                    <Feature key={f.featureId.toString()} featureId={f.featureId.toString()} title={f.title} description={f.description} createdDate={f.createdDate} likeCount={f.likeCount} liked={liked.includes(f.featureId.toString())}/>
                ))}
            </div>
            <Card>
                <CardContent>
                    <CardTitle className='text-slate-500 font-semibold text-lg'>You would like to submit a feature ?</CardTitle>
                    <div className="flex flex-row items-center gap-5 py-2">
                        <Megaphone className='text-slate-500' width={30} height={30} />
                        <p className="text-slate-500">You can join us on <a className='text-violet-500 underline' href="https://discord.gg/GBxRWQa6Dw">our discord</a> and submit any idea you got !</p>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}