import {NextResponse} from "next/server";
import {getComposeByShareId} from "@/actions/composeActions";
import {Translator} from "@composecraft/docker-compose-lib";
import YAML from "yaml";
import {jwtVerify} from "jose";
import {registerComposeWithoutMetadata} from "@/actions/userActions";
import {ObjectId} from "bson";

export async function GET(req: Request) {
    const id = new URL(req.url).searchParams.get("id");

    if (id) {
        const compose = await getComposeByShareId(id);

        if (compose?.data) {

            const c = Translator.fromDict(compose.data[0].data)
            const t = new Translator(c)
            const blob = new Blob([YAML.stringify(t.toDict())], { type: 'text/yaml' });
            const headers = new Headers();
            headers.set("Content-Type", "application/x-yaml");


            return new NextResponse(blob, { status: 200, statusText: "OK", headers });
        } else {
            return NextResponse.json({ error: "Compose data not found" }, { status: 404 });
        }
    } else {
        return NextResponse.json({ error: "ID not found" }, { status: 400 });
    }
}

export async function POST(req: Request) {
    const token = req.headers.get("Authorization")
    if(token){
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            console.error("SECRET_KEY is not configured");
            return NextResponse.json({error: "Server configuration error"}, {status: 500})
        }

        const encodedSecretKey = new TextEncoder().encode(secretKey);
        try{
            const {payload} = await jwtVerify(token || "", encodedSecretKey);
            const body = await req.json();
            const compose = Translator.fromDict(body)
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
