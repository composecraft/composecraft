"use client"

import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import GithubAuth from "@/components/ui/githubAuth";
import {Separator} from "@/components/ui/separator";
import {FormEvent} from "react";
import {getApiToken} from "@/actions/userActions";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

export default function Dashboard() {

    const router = useRouter()

    async function handleSubmit(e:FormEvent){
        e.preventDefault()
        const form = e.target as HTMLFormElement;

        // Access the input values by name
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        let token = ""
        try{
            token = await getApiToken(email,password)
        }catch(e:any){
            toast.error("bad credentials")
          console.error(e)
        }
        fetch("http://localhost:5555?token="+token).then(resp=>{
            if(resp.ok){
                router.push('/login/cli/success')
            }
        }).catch(()=>{
            toast.error("Error communicating with the CLi, is it still running ?")
        })
    }

    return(
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
                <CardContent className="p-5">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <h1 className="text-3xl text-primary font-bold">Connect the CLI !</h1>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input required name="email" placeholder="your@email.fr"/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">password</Label>
                            <Input required name="password" type="password"/>
                        </div>
                        <Button data-umami-event="login-btn" type="submit">login</Button>
                        <Separator />
                            <GithubAuth cli={true}  />
                        <Separator />
                        <div className="flex flex-row gap-5">
                            <Button data-umami-event="create-account-link" asChild variant="default" className="w-1/2">
                                <Link href="/signin">Create an account</Link>
                            </Button>
                            <Button data-umami-event="password-recover" variant="outline" className="w-1/2">
                                <Link href="/forgotPassword">Password recover</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}