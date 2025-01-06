import {Check} from "lucide-react";

export default function CheckedItem({text}:{text:string}) {
    return (
        <span className="flex flex-row items-center gap-2">
            <Check className="text-green-700 stroke-[4px]"/>
            <p>{text}</p>
        </span>
    )
}