import {KeyValue} from "@composecraft/docker-compose-lib";
import {Card, CardContent} from "@/components/ui/card";
import {Key} from "lucide-react";
import Selectable from "@/components/playground/node/Selectable";
import useSelectionStore from "@/store/selection";
import {Handle, Position} from "@xyflow/react";

export default function EnvNode({ data }:{data:{env:KeyValue}}) {

    const {selectedId} = useSelectionStore()

    return (
        <Selectable id={data.env.id}>
            <Card className={`flex border-2 border-violet-500 ${selectedId===data.env.id ? "bg-violet-100" : ""}`}>
                <CardContent className="p-3">
                    <div className="flex flex-row gap-3 items-center">
                        <Key className="stroke-violet-500" height={30}/>
                        <span className="flex flex-col" >
                            <p className="">{data.env?.key}</p>
                        </span>
                    </div>
                </CardContent>
            </Card>
            <Handle id='env' type="target" position={Position.Right} isConnectable={true} />
        </Selectable>
    );
}