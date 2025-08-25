"use client"

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import QuickToolType from "@/components/ui/quickToolType";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import GithubAuth from "@/components/ui/githubAuth";
import {useAction} from "next-safe-action/hooks";
import {registerUser} from "@/actions/userActions";
import toast from "react-hot-toast";
import {useState} from "react";
import {useComposeStore} from "@/store/compose";
import {Translator} from "@composecraft/docker-compose-lib";
import usePositionMap from "@/store/metadataMap";
import {extractMetadata} from "@/lib/metadata";
import { useRouter } from 'next/navigation'

export default function EmbedSignin({redirectToPlayGround=false}:{redirectToPlayGround?:boolean}){

    const {compose} = useComposeStore()
    const {positionMap} = usePositionMap()
    const router = useRouter()

    const {execute} = useAction(registerUser,{
        onSuccess:()=>{router.push("/dashboard")},
        onError:((e)=>{
            if(e?.error?.serverError){
                toast.error(e?.error?.serverError.toString())
            }else{
                console.log(e)
                toast.error("this email is probably already used")
            }
        })
    })

    const [companyType, setCompanyType] = useState("")

    const handleSubmit = (formData:FormData) => {
        if(redirectToPlayGround){
            const t = new Translator(compose)
            formData.append("data", JSON.stringify({
                compose: t.toDict(),
                metadata : extractMetadata(compose, positionMap),
            }))
        }
        execute(formData);
    };

    return (
        <form action={handleSubmit} className="flex flex-col gap-5">
            <h1 className="text-3xl text-primary font-bold bg-gradient-to-r from-[#1A96F8] via-[#3AA8FF] to-[#62BEFF] w-fit text-transparent bg-clip-text">Create an account</h1>
            <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input required name="email" placeholder="your@email.fr"/>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="password">password</Label>
                <Input required name="password" type="password"/>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="company" className="flex justify-between">
                    Company type
                    <QuickToolType className="" message={"This won't affect pricing"}/>
                </Label>
                <Select onValueChange={(value) => {
                    setCompanyType(value)
                }}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder="select a company type"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={"individual"}>Individual</SelectItem>
                        <SelectItem value={"startup"}>Start Up</SelectItem>
                        <SelectItem value={"serviceCompany"}>IT service company</SelectItem>
                        <SelectItem value={"other"}>Other</SelectItem>
                    </SelectContent>
                </Select>
                <input type="hidden" name="company" value={companyType}/>
            </div>
            <div className="flex flex-row items-center gap-3">
                <Checkbox required id="terms" name="terms"/>
                <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Accept <Link className="underline" href="/cgu.pdf">terms and conditions</Link>
                </label>
            </div>
            <Button className="bg-gradient-to-r from-[#1A96F8] via-[#3AA8FF] to-[#62BEFF]" data-umami-event="create-account-btn-submit" type="submit">Create an account</Button>
            <Separator/>
            <div className="flex flex-row w-full">
                <GithubAuth/>
            </div>
            <Separator/>
            <div className="flex flex-row gap-5">
                <Button data-umami-event="login-link" asChild variant="default" className="w-1/2">
                    <Link href="/login">Login</Link>
                </Button>
                <Button variant="outline" className="w-1/2">
                    <Link href="/public">Password recover</Link>
                </Button>
            </div>
        </form>
    )
}