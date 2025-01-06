import Link from "next/link";
import {default as NextImage} from "next/image";
import logo from "@/assets/logo_mark.jpg";
import {Button} from "@/components/ui/button";
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {Bug, Container} from "lucide-react";

export default function Nav(){
    return (
        <nav className="flex flex-col gap-5 md:gap-0 md:flex-row justify-between px-10 py-5 items-center">
                <span>
                    <Link className="text-xl font-semibold" href={"/"}>
                        <NextImage src={logo} className="h-14 object-contain w-fit" alt="logo"/>
                    </Link>
                </span>
            <NavigationMenu>
                <NavigationMenuList className="font-semibold gap-10">
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="font-semibold text-md">
                            Products
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="flex flex-col p-2 gap-2 z-50">
                            <NavigationMenuLink asChild>
                                <Link href={"/"} >
                                    <div className="flex gap-3 flex-row items-center rounded-md p-2 bg-violet-50 hover:bg-violet-100">
                                        <span className="bg-violet-300 p-1 rounded-lg">
                                            <Container />
                                        </span>
                                        <p className="w-40">Edit and visualize</p>
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                            {/*
                            <NavigationMenuLink asChild>
                                <Link href={"/"} >
                                    <div className="flex gap-3 flex-row items-center rounded-md p-2 bg-blue-50 hover:bg-blue-100">
                                        <span className="bg-blue-300 p-1 rounded-lg">
                                            <BookCheck />
                                        </span>
                                        <p className="w-40">Document your stack</p>
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                            */}
                            <NavigationMenuLink asChild>
                                <Link href={"/debug"} >
                                    <div className="flex gap-3 flex-row items-center rounded-md p-2 bg-red-50 hover:bg-red-100">
                                        <span className="bg-red-300 p-1 rounded-lg">
                                            <Bug />
                                        </span>
                                        <p className="w-40">Debug docker infra</p>
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link data-umami-event="library-link" href={"https://composecraft.com/library"}><p className="hidden lg:flex">Docker compose library</p>
                                <p className="lg:hidden">Library</p></Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link data-umami-event="docs-link" href={"https://composecraft.com/docs"}>Docs</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
                <span className="hidden md:flex flex-row gap-5">
                        <Button data-umami-event="nav-get-started" asChild>
                            <Link href={"/tryIt/playground"}>Get started</Link>
                        </Button>
                        <Button data-umami-event="nav-login" asChild variant="outline"
                                className="border-2 border-slate-500">
                            <Link href={"/login"}>Log in</Link>
                        </Button>
                    </span>
        </nav>
    )
}