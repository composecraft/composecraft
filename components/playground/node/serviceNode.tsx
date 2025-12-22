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
            <Card className={`flex hover:border-dashed hover:bg-slate-50 border-2 border-blue-500 ${selectedId===data.service.id ? "bg-blue-100" : ""}`}>
                <CardContent className="p-3">
                    <div className="flex flex-row gap-3 items-center h-[40px]">
                        <Container className="stroke-blue-500" height={30}/>
                        <span className="flex flex-col">
                            <p className="">{data.service?.name}</p>
                            <p className="text-xs text-slate-500">{data.service?.image?.toString()}</p>
                        </span>
                    </div>
                    <Separator/>
                    <span className="relative flex items-center pl-6 py-2 transform -translate-x-[16px]">
                        <p>Networks</p>
                        <Handle
                            id='network'
                            type="source"
                            position={Position.Left}
                            isConnectable={true}
                            className="!left-0 !top-1/2 !-translate-y-1/2"
                        />
                    </span>
                    <Separator/>
                    <span className="relative flex items-center pr-6 py-2 justify-end transform translate-x-[16px]">
                        <p>Volumes</p>
                        <Handle
                            id='volume'
                            type="source"
                            position={Position.Right}
                            isConnectable={true}
                            className="!right-0 !top-1/2 !-translate-y-1/2"
                        />
                    </span>
                    <Separator/>
                    <span className="relative flex items-center pl-6 py-2 transform -translate-x-[16px]">
                        <p>Env</p>
                        <Handle
                            id='env'
                            type="source"
                            position={Position.Left}
                            isConnectable={true}
                            className="!left-0 !top-1/2 !-translate-y-1/2"
                        />
                    </span>
                    <Separator/>
                    <span className="relative flex items-center pl-6 py-2 transform -translate-x-[16px]">
                        <p>Label</p>
                        <Handle
                            id='label'
                            type="source"
                            position={Position.Left}
                            isConnectable={true}
                            className="!left-0 !top-1/2 !-translate-y-1/2"
                        />
                    </span>
                </CardContent>
            </Card>
            <Handle id='service' type="source" position={Position.Bottom} isConnectable={true}/>
        </Selectable>
    );
}
