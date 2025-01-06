import {getAllMyComposeOrderByEditDate} from "@/actions/userActions";
import {DataTable} from "@/components/display/dataTable";
import {columns} from "@/components/display/composeTable/colums";
import {Separator} from "@/components/ui/separator";
import discordLogo from "@/assets/discord-logo-white.svg"
import Image from "next/image";
import FirstCompose from "@/components/ui/fisrtCompose";
import BetaWarning from "@/components/ui/betaWarning";


export default async function Page() {
    const composes = await getAllMyComposeOrderByEditDate();

    return (
        <div className="container mx-auto py-10">
            <span>
                <p className="text-2xl font-bold mb-10">My composes :</p>
            </span>
            <BetaWarning />
            {
                composes.length > 0 ? <DataTable columns={columns} data={composes.map((c) => ({
                    id: c.id.toString(),
                    name: c.data?.name,
                    createdAt: c.createdAt,
                    updatedAt: c.updatedAt
                }))}/> : <FirstCompose />
            }
            <Separator/>
            <p className="text-2xl font-bold my-5">Join Us :</p>
            <div className="flex flex-row">
                <a className="bg-slate-100 w-40 h-12 flex rounded-lg px-7 cursor-pointer hover:w-44 transition-all" href="https://discord.gg/GBxRWQa6Dw" target="_blank" >
                    <Image className="h-full" src={discordLogo} alt="join us on discord"/>
                </a>
            </div>
        </div>
    );
}