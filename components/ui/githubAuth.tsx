import {Button} from "@/components/ui/button";
import {AuthWithGithub} from "@/actions/github";
import toast from "react-hot-toast";
import Image from "next/image";
import { isCoreOnly } from "@/lib/config";

import ghLogo from "@/assets/github-mark-white.png"

export default function GithubAuth({cli=false}:{cli?:boolean}){
    // Hide OAuth in CORE_ONLY mode (self-hosted instances)
    if (isCoreOnly()) {
        return null;
    }

    async function handleConnect(){
        try{
            await AuthWithGithub(cli)
        }catch (e){
            toast.error("error: " + e?.toString())
        }
    }

    return <Button type="button" className="flex flex-row gap-2 w-full" onClick={()=>handleConnect()}>
        <Image height={22} src={ghLogo} alt={"github logo"} />
        <p>github</p>
    </Button>
}
