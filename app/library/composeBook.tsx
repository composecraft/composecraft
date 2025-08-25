import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";
import {addExtraDots} from "@/lib/utils";

type Item = {
    name: string;
};

export type ItemList = {
    item: Item;
}[];

export interface ComposeBookType {
    id: number;
    status: string;
    date_created: string; // ISO 8601 format date string
    title: string;
    shareId: string;
    description?: string;
    content: string;
    tags: ItemList; // Assuming the Array contains strings
    doc: string;
    logo?: string; // Assuming it's an ID or file identifier
    date_updated: string; // ISO 8601 format date string
}

function flat_tags(input:ItemList):string[]{
    return input.map(it=>it?.item?.name)
}

export default function ComposeBook(item:ComposeBookType){

    return(
        <Link href={`/library/${item.id}`}>
            <Card className="w-full h-48 bg-dot bg-cover bg-opacity-100">
                <CardContent className="p-3 flex flex-col justify-between h-full">
                    <div className="flex flex-row">
                        <div className="flex flex-col gap-3">
                            <p className="text-xl font-bold">{item.title}</p>
                            <p className="text-sm text-slate-600">{item?.description && addExtraDots(item?.description, 200)}</p>
                        </div>
                        <img alt="logo" className="w-10 h-10 rounded object-cover"
                             src={`https://directus.composecraft.com/assets/${item.logo}`}/>
                    </div>
                    <div className='flex flex-row gap-2'>
                        {item.tags && flat_tags(item.tags).splice(0, 3).map((tag,i) => (
                            <div key={i} className="text-sm text-violet-500 p-1 px-2 bg-slate-100 rounded">
                                {tag}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}