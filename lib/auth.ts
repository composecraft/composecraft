import {cookies} from "next/headers";
import {jwtVerify} from "jose";

export async function ensureAuth(){
    const rawToken = (await cookies()).get("token")?.value;
    
    if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY environment variable is not configured. Cannot verify authentication.");
    }
    
    const secretKey = new TextEncoder().encode(process.env.SECRET_KEY);
    const {payload} = await jwtVerify(rawToken || "", secretKey);
    return payload
}
