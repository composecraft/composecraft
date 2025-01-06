import {getAllMyShares} from "@/actions/composeActions";
import {DataTable} from "@/components/display/dataTable";
import {columns} from "@/components/display/shareTable/colums";
import FirstCompose from "@/components/ui/fisrtCompose";

export default async function (){

    const myShares = await getAllMyShares()

    return(
        <div className="container mx-auto py-10">
            <span>
                <p className="text-2xl font-bold mb-10">My composes shares :</p>
            </span>
            {
                myShares.length > 0 ? <DataTable columns={columns} data={myShares.map((s) => ({
                    id: s._id.toString(),
                    composeName: s?.name,
                    createdAt: s?.createdAt,
                    link: `${process.env.URL}/share?id=${s._id.toString()}&name=${s?.name}`
                }))}/> : <FirstCompose />
            }
        </div>
    )
}