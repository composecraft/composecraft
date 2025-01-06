"use client"

import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useAction} from "next-safe-action/hooks";
import {passwordReset} from "@/actions/userActions";
import toast from "react-hot-toast";
import {useRouter, useSearchParams} from "next/navigation";
import {Suspense} from "react";

function Reset() {

    const router = useRouter()
    const searchParams = useSearchParams()

    const {execute} = useAction(passwordReset,{
        onSuccess: ()=>{toast.success("password reseted");router.push("/login")},
        onError:(e)=>{console.log(e);toast.error(`error : ${e.error.serverError || e.error.validationErrors?.password?._errors?.join(",")}`)},
    })

    const handleSubmit = (formData:FormData) => {
        // If reset code exists, append it to the form data
        const code = searchParams.get('code')
        console.log(code)
        if (code) {
            formData.append('code', code);
        }
        execute(formData);
    };

    return(
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
                <CardContent className="p-5">
                    <form action={handleSubmit} className="flex flex-col gap-5">
                        <h1 className="text-3xl text-primary font-bold">Reset Password ?</h1>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input required name="password" type='password'/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password2">Repeat new Password</Label>
                            <Input required name="password2" type='password'/>
                        </div>
                        <Button type="submit">Change password</Button>
                        <Link href="/login">
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

export default function Page(){
    return(
        <Suspense>
            <Reset />
        </Suspense>
    )
}