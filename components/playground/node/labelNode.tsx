import {KeyValue} from "@composecraft/docker-compose-lib";
import {Card, CardContent} from "@/components/ui/card";
import {Tag} from "lucide-react";
import Selectable from "@/components/playground/node/Selectable";
import useSelectionStore from "@/store/selection";
import {Handle, Position} from "@xyflow/react";

export default function LabelNode({ data }:{data:{label:KeyValue}}) {

    const {selectedId} = useSelectionStore()

    return (
        <Selectable id={data.label.id}>
            <Card className={`flex border-2 border-pink-500 ${selectedId===data.label.id ? "bg-pink-100" : ""}`}>
                <CardContent className="p-3">
                    <div className="flex flex-row gap-3 items-center">
                        <Tag className="stroke-pink-500" height={30}/>
                        <span className="flex flex-col" >
                            <p className="">{data.label?.key}</p>
                        </span>
                    </div>
                </CardContent>
            </Card>
            <Handle id='label' type="target" position={Position.Right} isConnectable={true} />
        </Selectable>
    );
}