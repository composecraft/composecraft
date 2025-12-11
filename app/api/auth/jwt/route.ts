import {NextRequest, NextResponse} from "next/server";
import {jwtVerify, SignJWT} from "jose";
import client from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function GET(req:NextRequest){
    // Use HTTP Basic Authentication instead of query parameters
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return NextResponse.json({error: "Missing or invalid Authorization header. Use Basic Authentication."}, {status: 401})
    }

    // Decode Basic Auth credentials
    const base64Credentials = authHeader.substring(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    if (!password || !email) {
        return NextResponse.json({error: "Invalid credentials format"}, {status: 400})
    }

    await client.connect()
    const db = client.db("compose_craft")
    const user = await db.collection("users").findOne({email: email})
    
    if(!user){
        return NextResponse.json({error: "Invalid email or password"}, {status: 401})
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return NextResponse.json({error: "Invalid email or password"}, {status: 401})
    }

    const secretKey = process.env.SECRET_KEY
    if (!secretKey) {
        console.error("SECRET_KEY is not configured");
        return NextResponse.json({error: "Server configuration error"}, {status: 500})
    }

    const token = await new SignJWT({userId:user._id, email: user?.email})
        .setProtectedHeader({alg: 'HS256'})
        .setExpirationTime('31d') // Set token expiration to 31 days
        .sign(new TextEncoder().encode(secretKey));
    return NextResponse.json({token: token}, {status: 200})
}

export async function POST(req:Request){
    const body = await req.json();
    const token = body.token;
    if(token){
        const secretKey = new TextEncoder().encode(process.env.SECRET_KEY || "");
        try{
            await jwtVerify(token || "", secretKey);
            return NextResponse.json({}, {status: 200})
        }catch (e:any){
            console.error(e)
            return NextResponse.json({error: "token is incorrect or outdated"}, {status: 403})
        }
    }
    return NextResponse.json({error: "token is missing"}, {status: 400})
}
