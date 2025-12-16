"use client"

import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useAction} from "next-safe-action/hooks";
import {loginUser} from "@/actions/userActions";
import toast from "react-hot-toast";

export default function Dashboard() {
    const router = useRouter()

    const {execute} = useAction(loginUser,{
        onSuccess:()=>{router.push("/dashboard")},
        onError:(()=>{
            toast.error("wrong password or email")
        })
    })

    return(
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
                <CardContent className="p-5">
                    <form action={execute} className="flex flex-col gap-5">
                        <h1 className="text-3xl text-primary font-bold">Welcome back !</h1>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input required name="email" placeholder="your@email.fr"/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">password</Label>
                            <Input required name="password" type="password"/>
                        </div>
                        <Button type="submit">login</Button>
                        <div className="flex flex-row gap-5">
                            <Button asChild variant="default" className="w-1/2">
                                <Link href="/signin">Create an account</Link>
                            </Button>
                            <Button variant="outline" type="button" className="w-1/2">
                                <Link href="/forgotPassword">Password recover</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
