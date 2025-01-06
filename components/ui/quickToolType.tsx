import {ReactElement} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {CircleHelp} from "lucide-react";

export default function QuickToolType({message,className,color="grey",width=20,height=20}:{message:string,className?:string,color?:string,width?:number,height?:number}):ReactElement{
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <CircleHelp width={width} height={height} className={className} color={color} />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{message}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}