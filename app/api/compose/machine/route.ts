import {NextResponse} from "next/server";
import {Compose, Network, Service, Translator, Image, Binding, Volume} from "@composecraft/docker-compose-lib";
import {jwtVerify} from "jose";
import {registerComposeWithoutMetadata} from "@/actions/userActions";
import {ObjectId} from "bson";

function getFormattedDate() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${day}/${month}_${hours}:${minutes}`;
}

export async function POST(req: Request) {
    const token = req.headers.get("Authorization")
    if(token){
        const secretKey = new TextEncoder().encode(process.env.SECRET_KEY || "");
        try{
            const {payload} = await jwtVerify(token || "", secretKey);
            const body = await req.json();
            const compose = new Compose()
            Object.keys(body?.containers || {}).forEach(key=>{
                compose.addService(new Service({
                    name: key,
                    image: new Image({
                        name: <string>body?.containers[key]?.image.split(":")[0],
                        tag: <string>body?.containers[key]?.image.split(":")[1]
                    })
                }))
            })
            Object.keys(body?.networks || {}).forEach(networkName=>{
                const concernedServicesNames = Object.keys(body?.containers || {}).filter(
                    containerKey=> (body?.containers[containerKey]?.networks as string[]).includes(networkName)
                )
                const concernedServices= Array.from(compose.services).filter(c=>concernedServicesNames.includes(c?.name))
                compose.addNetwork(new Network({name: networkName}),concernedServices)
            })
            Object.keys(body?.volumes)?.forEach(volumeName=>{
                const concernedServicesNames = Object.keys(body?.containers || {}).filter(
                    containerKey=> (body?.containers[containerKey]?.volumes as string[]).includes(volumeName)
                )
                const concernedServices= Array.from(compose.services).filter(c=>concernedServicesNames.includes(c?.name))
                compose.addBinding(new Binding({
                    source: body?.volumes[volumeName]?.type === "bind" ?
                        body?.volumes[volumeName]?.source as string:
                        new Volume({name: volumeName}),
                    target: ""
                }),concernedServices)
            })
            compose.name = `cli-${getFormattedDate()}`
            const t = new Translator(compose)
            const composeId = await registerComposeWithoutMetadata(t.toDict(),new ObjectId(payload.userId as string))
            return NextResponse.json({id: composeId}, {status: 200})
        }catch (e:any){
            console.error(e)
            return NextResponse.json({error: "token is incorrect or outdated"}, {status: 403})
        }
    }
    return NextResponse.json({error: "token is missing"}, {status: 403})
}
