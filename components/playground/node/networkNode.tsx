import {Network} from "@composecraft/docker-compose-lib";
import {Card, CardContent} from "@/components/ui/card";
import {NetworkIcon} from "lucide-react";
import Selectable from "@/components/playground/node/Selectable";
import useSelectionStore from "@/store/selection";
import {Handle, Position} from "@xyflow/react";

export default function NetworkNode({ data }:{data:{network:Network}}) {

    const {selectedId} = useSelectionStore()

    return (
        <Selectable id={data.network.id}>
            <Card className={`flex border-2 border-orange-500 ${selectedId===data.network.id ? "bg-orange-100" : ""}`}>
                <CardContent className="p-3">
                    <div className="flex flex-row gap-3 items-center">
                        <NetworkIcon className="stroke-orange-500" height={30}/>
                        <span className="flex flex-col" >
                            <p className="">{data.network?.name}</p>
                        </span>
                    </div>
                </CardContent>
            </Card>
            <Handle id='network' type="target" position={Position.Right} isConnectable={true} />
        </Selectable>
    );
}