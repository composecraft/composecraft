import {cookies} from "next/headers";
import {jwtVerify} from "jose";

export async function ensureAuth(){
    const rawToken = cookies().get("token")?.value;
    const secretKey = new TextEncoder().encode(process.env.SECRET_KEY || "");
    const {payload} = await jwtVerify(rawToken || "", secretKey);
    return payload
}