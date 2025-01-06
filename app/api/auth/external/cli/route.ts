import {NextResponse} from "next/server";
import client from "@/lib/mongodb";
import {getGithubAccesToken} from "@/actions/github";
import axios from "axios";
import {createOrLoginUser} from "@/actions/userActions";
import {registerUserToBrevo} from "@/lib/brevo";
import {SignJWT} from "jose";

export async function GET(req:Request){
    const state = new URL(req.url).searchParams.get("state")
    const code = new URL(req.url).searchParams.get("code")

    //ensure state is valid
    await client.connect()
    const db = client.db("compose_craft")
    const CSRF_collection = db.collection('csrf_token')
    const token = await CSRF_collection.findOne({token: state})
    if(!token || !code){
        return NextResponse.json({msg: "unauthorized"},{status: 401})
    }
    await CSRF_collection.deleteOne({token: state})
    try{
        const ghToken = await getGithubAccesToken(code)
        console.log(ghToken)
        const resp = await axios.get('https://api.github.com/user',{
            headers:{
                Authorization : `Bearer ${ghToken}`
            }
        })
        if(!resp.data.email){
            return NextResponse.json({error: "You can't sign with github because we don't have acces to your github account email"}, {status: 406})
        }
        const brevoId = await registerUserToBrevo({email: resp.data.email})
        const user = {
            termsAccepted: true,
            brevoId: brevoId,
            external: "github",
            infos: {
                company: resp.data?.company,
                avatar_url: resp.data?.avatar_url,
                blog: resp.data?.blog,
                githubId: resp?.data?.id,
                location: resp?.data?.location,
                githubFollowers : resp?.data?.followers,
                notification_email: resp?.data?.notification_email
            }
        }
        const userId = await createOrLoginUser(resp.data.email,user)
        const secretKey = process.env.SECRET_KEY
        const token = await new SignJWT({userId:userId, email: resp.data.email})
            .setProtectedHeader({alg: 'HS256'})
            .setExpirationTime('31d') // Set token expiration to 31 days
            .sign(new TextEncoder().encode(secretKey));
        return NextResponse.redirect(`http://localhost:5555?token=${token}`)
    }catch (e){
        //console.error(e)
        return NextResponse.json({error: e?.toString()}, {status: 500})
    }
}