"use client"

import Link from "next/link";
import {default as NextImage} from "next/image";
import logo from "@/assets/logo_mark.jpg";
import {Button} from "@/components/ui/button";
import {House, LogOut, Megaphone, Settings, Share} from "lucide-react";
import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {Avatar,AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {logout} from "@/actions/userActions";

export default function ClientLayout({children,version}:{children:ReactNode,version:string}) {

    const pathname = usePathname()

    return(
        <section className="mx-10 h-full flex flex-col">
            <nav className='flex flex-row items-center my-3 gap-5 justify-between'>
                <div className='flex flex-row items-center gap-5'>
                    <Link href={"/dashboard"}>
                        <NextImage src={logo} className="h-14 object-contain w-fit" alt="logo"  />
                    </Link>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="pr-5">
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>🐳</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={()=>logout()} className="flex flex-row gap-2 text-slate-500">
                            <LogOut />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
            <div className='flex flex-row flex-grow'>
                <div className='flex flex-col w-1/6 mt-10 flex-grow'>
                    <Link href={"/dashboard/playground"}>
                        <Button className='w-fit'>
                            New Compose
                        </Button>
                    </Link>
                    <div className="my-10 flex flex-col justify-between h-full">
                        <div className="flex flex-col gap-5">
                            <Link className={cn("flex flex-row gap-5 text-slate-400",{
                                "text-black" : pathname.endsWith("dashboard")
                            })} href={"/dashboard"}>
                                <House/> Home
                            </Link>
                            <Link className={cn("flex flex-row gap-5 text-slate-400",{
                                "text-black" : pathname.endsWith("shares")
                            })} href={"/dashboard/shares"}>
                                <Share /> My shares
                            </Link>
                            <Link className={cn("flex flex-row gap-5 text-slate-400",{
                                "text-black" : pathname.endsWith("upcomingFeatures")
                            })} href={"/dashboard/upcomingFeatures"}>
                                <Megaphone /> Umpcoming features
                            </Link>
                            <Link className={cn("flex flex-row gap-5 text-slate-400",{
                                "text-black" : pathname.endsWith("settings")
                            })} href={"/dashboard/settings"}>
                                <Settings/> Settings
                            </Link>
                        </div>
                        <p className="text-slate-300">Compose craft v{version}</p>
                    </div>
                </div>
                <div className='flex w-5/6'>
                    {children}
                </div>
            </div>
        </section>
    )
}