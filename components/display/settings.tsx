"use client"

import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger} from "@/components/ui/dialog";
import {deleteUser} from "@/actions/userActions";
import toast from "react-hot-toast";


interface settingsInitData {
    email: string
}

export default function Settings({init}:{init?:settingsInitData}){

    const [email, ] = useState(init?.email)
    const [confirm, setConfirm] = useState("")

    async function handleDelete(){
        try{
            const res = await deleteUser()
            if(res){
                window.location.href = "https://form.composecraft.com/s/cm40i9zod000hwl0z6005uvwp"
            }
        }catch(e){
            toast("error")
            console.error(e)
        }
    }

    return (
        <section className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
                <label>Email</label>
                <Input className="w-96" type="email" value={email} disabled/>
            </div>
            <Separator />
            <div className='flex flex-col gap-5'>
                <p className="text-xl font-bold">Danger Zone :</p>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className='w-fit' variant="destructive">
                            Delete my account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="text-lg font-bold">Do you really want to delete your account ?</DialogHeader>
                        <div>
                            <p>This will destroy the account and all data we have about you, <strong>You will loose all your data</strong></p>
                            <p className="my-3">To delete your account, please type bellow : "delete my account and loose my data"</p>
                            <Input placeholder="confirm" value={confirm} onChange={e=>setConfirm(e.target.value)} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" onClick={()=>(handleDelete())} disabled={confirm !== "delete my account and loose my data"} variant="destructive">
                                Delete My account
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    )
}