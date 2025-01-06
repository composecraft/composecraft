import useSelectionStore from "@/store/selection";
import {useComposeStore} from "@/store/compose";
import {Network} from "@composecraft/docker-compose-lib";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Toggle} from "@/components/ui/toggle";
import {Unlink, Link, Blocks, Grid2x2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export default function NetowrkEditor(){

    const {selectedId} = useSelectionStore();
    const {compose, setCompose} = useComposeStore()

    function getNetwork():Network{
        const service = compose.networks.get("id",selectedId)
        if(service){
            return service
        }
        throw Error(`${selectedId} network is not found`)
    }

    return(
        <form className="flex flex-col gap-5">
            <p className="text-2xl font-semibold">Network</p>
            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Name</label>
                    <Input name="name" value={getNetwork().name}
                           onChange={(e) => {
                               setCompose(() => getNetwork().name = e.target.value)
                           }}
                    />
                </div>
            </div>
            <Separator />
            <div className="flex flex-row gap-3">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger type="button">
                            <Toggle type="button" variant="outline" onClick={()=>setCompose(()=>{getNetwork().attachable = !getNetwork().attachable})}>
                                {!getNetwork().attachable ? <Unlink height={30} /> : <Link />}
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>If the network is attachable after creation</p>
                            <p>(current state : {getNetwork().attachable ? "Attachable" : "Not attachable"})</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger type="button">
                            <Toggle type="button" variant="outline" onClick={()=>setCompose(()=>{getNetwork().external = !getNetwork().external})}>
                                {getNetwork().external ? <Blocks /> : <Grid2x2 />}
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Is the network external ? </p>
                            <p>(current state : {getNetwork().external ? "External" : "Internal"})</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </form>
    )
}