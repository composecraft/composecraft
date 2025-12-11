"use server"

import * as crypto from "node:crypto";

import client from "@/lib/mongodb";
import {NextResponse} from "next/server";
import {redirect} from "next/navigation";
import axios from "axios";

export async function getGithubAccesToken(code:string){
    const res = await axios.get(
        "https://github.com/login/oauth/access_token",
        {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code
            },
            headers: {
                "Accept": "application/json",
                "Accept-Encoding": "application/json",
            },
        }
    );
    return res.data.access_token;
}

export async function AuthWithGithub(cli:boolean){
    await client.connect()
    const db = client.db("compose_craft")
    const CSRF_collection = db.collection('csrf_token')
    const randomString = crypto.randomBytes(32).toString('hex');
    CSRF_collection.insertOne({
        token: randomString,
        createdAt: new Date().getTime() // FIXED: Changed from getDate() to getTime() for proper timestamp
    })
    const githubClientId = process.env.GITHUB_CLIENT_ID
    const redirectUri =  process.env.URL+"/api/auth/external"
    if(!githubClientId){
        return NextResponse.json({msg: "unvaible"},{status: 500})
    }
    const link = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&response_type=code&scope=read:user&redirect_uri=${redirectUri}${cli ? "/cli": ""}&state=${randomString}`;
    redirect(link)
}
