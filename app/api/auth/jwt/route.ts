import {NextRequest, NextResponse} from "next/server";
import {jwtVerify, SignJWT} from "jose";
import client from "@/lib/mongodb";

export async function GET(req:NextRequest){
    const email = req.nextUrl.searchParams.get("email")
    const password = req.nextUrl.searchParams.get("password")
    if(!password || !email){
        return NextResponse.json({error: "url search params must contains email and password"}, {status: 400})
    }
    await client.connect()
    const db = client.db("compose_craft")
    const user = await db.collection("users").findOne({email: email})
    if(!user){
        return NextResponse.json({error: "There is no user with such email or the password is wrong"}, {status: 400})
    }
    const secretKey = process.env.SECRET_KEY
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