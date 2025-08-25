"use server"

import {cookies} from "next/headers";
import {jwtVerify} from "jose";
import client from "@/lib/mongodb";
import {ObjectId} from "bson";
import {revalidatePath} from "next/cache";

export type FeatureType = {
    featureId: string;
    title: string;
    description: string;
    createdDate: number;
    likeCount: number;
}

export const getAllFeatures = async () => {
    const rawToken = (await cookies()).get("token")?.value;
    const secretKey = new TextEncoder().encode(process.env.SECRET_KEY || "");
    const { payload } = await jwtVerify(rawToken || "", secretKey);
    const userId = new ObjectId(payload.userId as string);

    await client.connect();
    const db = client.db("compose_craft");
    const featureLikesView = db.collection("featureLikesView");
    const likeCollection = db.collection("like")

    try {
        // Find all documents for the user, sort by updatedAt in descending order
        const features = await featureLikesView.find().sort({ createdDate: -1 }).toArray() as unknown as FeatureType[];
        const liked = await likeCollection.find({userLiking: userId},{projection:{
                _id: 0,
                featureLiked: 1
            }}).toArray()

        const featureIds = liked.map(like => like.featureLiked.toString() as string);

        return {
            features: features,
            liked: featureIds,
        }

    } catch (error) {
        console.error(error)
        throw new Error("Failed to fetch composes");
    }
};

export const toggleFeatureLike = async (featureId:string) => {
    const rawToken = (await cookies()).get("token")?.value;
    const secretKey = new TextEncoder().encode(process.env.SECRET_KEY || "");
    const { payload } = await jwtVerify(rawToken || "", secretKey);
    const userId = new ObjectId(payload.userId as string);

    await client.connect();
    const db = client.db("compose_craft");
    const likeCollection = db.collection("like")

    try {
        // Find all documents for the user, sort by updatedAt in descending order
        const liked = await likeCollection.findOne({
            userLiking: userId,
            featureLiked: new ObjectId(featureId)
        })

        if(liked?._id){
            await likeCollection.deleteOne({_id : liked?._id})
        }else{
            await likeCollection.insertOne({
                userLiking: userId,
                featureLiked: new ObjectId(featureId)
            })
        }
        revalidatePath("/dashboard/upcomingFeatures","page")
        return true
    } catch (error) {
        console.error(error)
        throw new Error("Failed to fetch composes");
    }
};