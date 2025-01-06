import {Binding} from "@composecraft/docker-compose-lib";
import {Card, CardContent} from "@/components/ui/card";
import {FolderTree} from "lucide-react";
import Selectable from "@/components/playground/node/Selectable";
import useSelectionStore from "@/store/selection";
import {Handle, Position} from "@xyflow/react";

export default function BindingNode({ data }:{data:{binding:Binding}}) {

    const {selectedId} = useSelectionStore()

    return (
        <Selectable id={data.binding.id}>
            <Card className={`flex border-2 border-green-500 ${selectedId===data.binding.id ? "bg-green-100" : ""}`}>
                <CardContent className="p-3">
                    <div className="flex flex-row gap-3 items-center">
                        <FolderTree className="stroke-green-500" height={30}/>
                        <span className="flex flex-col" >
                            <p className="">{data.binding.source.toString()}</p>
                        </span>
                    </div>
                </CardContent>
            </Card>
            <Handle id='volume' type="target" position={Position.Left} isConnectable={true} />
        </Selectable>
    );
}