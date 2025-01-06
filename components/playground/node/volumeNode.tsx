import {Volume} from "@composecraft/docker-compose-lib";
import {Card, CardContent} from "@/components/ui/card";
import {Folder} from "lucide-react";
import Selectable from "@/components/playground/node/Selectable";
import useSelectionStore from "@/store/selection";
import {Handle, Position} from "@xyflow/react";

export default function VolumeNode({ data }:{data:{volume:Volume}}) {

    const {selectedId} = useSelectionStore()

    return (
        <Selectable id={data.volume.id}>
            <Card className={`flex border-2 border-green-500 ${selectedId===data.volume.id ? "bg-green-100" : ""}`}>
                <CardContent className="p-3">
                    <div className="flex flex-row gap-3 items-center">
                        <Folder className="stroke-green-500" height={30}/>
                        <span className="flex flex-col" >
                            <p className="">{data.volume?.name}</p>
                        </span>
                    </div>
                </CardContent>
            </Card>
            <Handle id='volume' type="target" position={Position.Left} isConnectable={true} />
        </Selectable>
    );
}