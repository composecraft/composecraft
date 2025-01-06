import {getComposeByShareId} from "@/actions/composeActions";
import ReadOnlyPlayGround from "@/components/playground/readonlyPlayground";
import {DetailedHTMLProps, HTMLAttributes} from "react";
import {ReactFlowProvider} from "@xyflow/react";

export default async function AsyncReadOnlyPlayground({shareId,options}:{shareId:string,options?:DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>}){

    if(!shareId || shareId.length < 24){
        return (
            <div {...options}>
                The share Id is incorrect
            </div>
        )
    }

    const compose = await getComposeByShareId(shareId)

    return(
        <div {...options}>
            <ReactFlowProvider>
                <ReadOnlyPlayGround compose={compose?.data[0].data} positionMap={compose?.data[0].metadata} />
            </ReactFlowProvider>
        </div>
    )
}