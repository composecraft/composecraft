"use client"

import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {askPasswordReset} from "@/actions/userActions";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

export default function Dashboard() {

    const router = useRouter()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        toast.promise(
            askPasswordReset(null, formData),
            {
                loading: "Sending reset email...",
                success: (result: any) => {
                    if (result?.error) {
                        throw new Error(result.error);
                    }
                    toast.success("Email sent");
                    router.push("/login");
                    return "Reset email sent successfully!";
                },
                error: (err: Error) => {
                    return err.message || "Failed to send reset email";
                }
            }
        );
    }

    return(
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
                <CardContent className="p-5">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
