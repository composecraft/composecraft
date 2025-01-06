import {Service} from "@composecraft/docker-compose-lib";
import {Handle, Position} from "@xyflow/react";
import {Card, CardContent} from "@/components/ui/card";
import {Container} from "lucide-react";
import Selectable from "@/components/playground/node/Selectable";
import useSelectionStore from "@/store/selection";
import {Separator} from "@/components/ui/separator";

export default function ServiceNode({ data }:{data:{service:Service}}) {

    const {selectedId} = useSelectionStore()

    return (
        <Selectable id={data.service.id}>
            <Handle id='service' type="target" position={Position.Top} isConnectable={true} />
            <Card className={`flex border-2 border-blue-500 ${selectedId===data.service.id ? "bg-blue-100" : ""}`}>
                <CardContent className="p-3">
                    <div className="flex flex-row gap-3 items-center h-[40px] mb-2">
                        <Container className="stroke-blue-500" height={30}/>
                        <span className="flex flex-col">
                            <p className="">{data.service?.name}</p>
                            <p className="text-xs text-slate-500">{data.service?.image?.toString()}</p>
                        </span>
                    </div>
                    <Separator/>
                    <span>
                        <Handle className="" id='network' type="source" position={Position.Left}
                                isConnectable={true}/>
                        <p>Networks</p>
                    </span>
                    <Separator/>
                    <span>
                        <Handle className="mt-6" id='volume' type="source" position={Position.Right}
                                isConnectable={true}/>
                        <p>Volumes</p>
                    </span>
                    <Separator/>
                    <span>
                        <Handle className="mt-12" id='env' type="source" position={Position.Left}
                                isConnectable={true}/>
                        <p>Env</p>
                    </span>
                </CardContent>
            </Card>
            <Handle id='service' type="source" position={Position.Bottom} isConnectable={true}/>
        </Selectable>
    );
}