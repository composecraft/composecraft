"use client"

import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useAction} from "next-safe-action/hooks";
import {askPasswordReset} from "@/actions/userActions";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

export default function Dashboard() {

    const router = useRouter()

    const {execute} = useAction(askPasswordReset,{
        onSuccess: ()=>{toast.success("Email sended");router.push("/login")},
        onError:(e)=>{toast.error(`error : ${e.error.serverError?.toString()}`)}
    })

    return(
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
                <CardContent className="p-5">
                    <form action={execute} className="flex flex-col gap-5">
                        <h1 className="text-3xl text-primary font-bold">Password lost ?</h1>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input required name="email" placeholder="your@email.fr"/>
                        </div>
                        <Button type="submit">Ask for a password reset</Button>
                        <Link href="/login" >
                            <Button variant="outline">
                                login
                            </Button>
                        </Link>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}