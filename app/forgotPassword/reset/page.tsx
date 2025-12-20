"use client"

import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {passwordReset} from "@/actions/userActions";
import toast from "react-hot-toast";
import {useRouter, useSearchParams} from "next/navigation";
import {Suspense} from "react";

function Reset() {

    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        // If reset code exists, append it to the form data
        const code = searchParams.get('code')
        console.log(code)
        if (code) {
            formData.append('code', code);
        }

        toast.promise(
            passwordReset(null, formData),
            {
                loading: "Resetting password...",
                success: (result: any) => {
                    if (result?.error) {
                        throw new Error(result.error);
                    }
                    toast.success("Password reset successful");
                    router.push("/login");
                    return "Password has been reset!";
                },
                error: (err: Error) => {
                    return err.message || "Failed to reset password";
                }
            }
        );
    };

    return(
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
                <CardContent className="p-5">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
