"use client"

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Copy, MoreHorizontal, Share, Trash2} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ComposeLine} from "@/components/display/composeTable/colums";
import {deleteCompose} from "@/actions/userActions";
import toast from "react-hot-toast";
import {useState} from "react";
import {shareCompose} from "@/actions/composeActions";

async function handleDelete(composeId:string){
    try{
        await deleteCompose(composeId)
        toast.success("deleted")
    }catch(e){
        console.error(e)
        toast.error("error")
    }
}

export default function ComposeRow(data:ComposeLine){

    const [shareOpen, setShareOpen] = useState(false)
    const [link, setLink]= useState("")

    async function handleShare(composeId:string){
        try{
            setShareOpen(true)
            const res = await shareCompose(composeId)
            setLink(`${res}&name=${data.name}`)
        }catch(e){
            console.error(e)
            toast.error("error")
        }
    }

    return(
        <div className='flex flex-row items-center gap-3'>
            <Link href={`/dashboard/playground?id=${data.id}`}>
                <Button>
                    See
                </Button>
            </Link>
            <DropdownMenu onOpenChange={open=>{if(!open)setShareOpen(false)}}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <Popover open={shareOpen} >
                        <PopoverTrigger asChild>
                            <DropdownMenuItem onClick={(e) => {
                                e.preventDefault(); // Prevent default click behavior
                                e.stopPropagation(); // Prevent event propagation to close the menu
                                handleShare(data.id)
                            }}>
                                <Share /> Share
                            </DropdownMenuItem>
                        </PopoverTrigger>
                        <PopoverContent sideOffset={-30} className="flex flex-col gap-2">
                            <span className="flex flex col justify-between rounded border-2 p-1">
                                <input className="outline-0" value={link} />
                                <button onClick={()=>{navigator.clipboard.writeText(link);toast("link copied")}} type="button" className='rounded bg-black text-white text-xs flex flex-row justify-center items-center gap-2 py-1 px-2 active:bg-slate-500 transition-all'>
                                    <Copy height={20} className='stroke-white' />
                                    <p>Copy</p>
                                </button>
                            </span>
                            <p className="text-sm text-slate-600">You can share this link to anyone, they won't require any account to view this compose</p>
                        </PopoverContent>
                    </Popover>
                    <DropdownMenuItem onClick={()=>{handleDelete(data.id.toString())}}>
                        <Trash2/> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}