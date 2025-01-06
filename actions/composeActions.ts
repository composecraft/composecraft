"use server"

import client from "@/lib/mongodb";
import {ObjectId} from "bson";
import {ensureAuth} from "@/lib/auth";
import {revalidatePath} from "next/cache";

export async function shareCompose(composeId: string) {
    const payload = await ensureAuth();

    await client.connect();
    const db = client.db("compose_craft");
    const shares = db.collection("shares");

    try {
        // Check if a share already exists for the given composeId
        const existingShare = await shares.findOne({
            composeId: new ObjectId(composeId),
            userId: new ObjectId(payload.userId as string),
        });

        revalidatePath("/dashboard/shares")

        if (existingShare) {
            // If a share already exists, return its ObjectId
            return `${process.env.URL}/share?id=${existingShare._id.toString()}`;
        }

        // If no existing share, create a new one
        const insert = await shares.insertOne({
            access: "public",
            composeId: new ObjectId(composeId),
            createdAt: new Date().getTime(),
            userId: new ObjectId(payload.userId as string),
        });

        if (!insert) {
            throw new Error("Could not share the docker compose file");
        }

        return `${process.env.URL}/share?id=${insert.insertedId.toString()}`;
    } catch (e) {
        console.error(e?.toString());
    }
}

export const getComposeByShareId = async (shareId: string) => {

    await client.connect();
    const db = client.db("compose_craft");
    const collection = db.collection("composeShare");

    try {
        // Convert the composeId string to ObjectId
        const compose = await collection.findOne({
            _id: new ObjectId(shareId)
        });

        // Return undefined if no compose is found
        if (!compose) {
            return undefined;
        }

        // Return the formatted compose data
        return {
            id: compose._id.toString(),
            data: compose.data
        };
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch compose");
    }
};

export const getAllMyShares = async () => {

    const payload = await ensureAuth();

    await client.connect();
    const db = client.db("compose_craft");
    const collection = db.collection("shares");

    try {
        // Convert the composeId string to ObjectId
        const shares = await collection.aggregate([
            {
                // Match documents based on userId
                $match: {
                    userId: new ObjectId(payload.userId as string),
                },
            },
            {
                // Join with the 'composes' collection
                $lookup: {
                    from: "composes", // Name of the collection to join
                    localField: "composeId", // Field in 'shares' collection
                    foreignField: "_id", // Field in 'composes' collection
                    as: "composeDetails", // Output array field for matched documents
                    pipeline: [
                        {
                            // Project only the 'name' field
                            $project: {
                                "data.name": 1, // Include only the 'name' field from 'data'
                                _id: 0, // Exclude the '_id' field (optional)
                            },
                        },
                    ],
                },
            },
            {
                // Unwind the 'composeDetails' array to make it a single object
                $unwind: {
                    path: "$composeDetails",
                    preserveNullAndEmptyArrays: true, // If no match, keep the document
                },
            },
            {
                // Add the 'name' field from 'composeDetails.data' to the main document
                $addFields: {
                    name: "$composeDetails.data.name",
                },
            },
            {
                // Remove the 'composeDetails' field as it's no longer needed
                $project: {
                    composeDetails: 0,
                },
            },
            {
                // Optionally sort the results
                $sort: { createdAt: -1 },
            },
        ]).toArray();

        // Return undefined if no compose is found
        if (!shares) {
            return [];
        }

        // Return the formatted compose data
        return shares
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch compose");
    }
};

export const deleteShareById = async (shareId: string) => {

    const payload = await ensureAuth();

    await client.connect();
    const db = client.db("compose_craft");
    const collection = db.collection("shares");

    try {
        // Convert the composeId string to ObjectId
        const compose = await collection.deleteOne({
            _id: new ObjectId(shareId),
            userId: new ObjectId(payload.userId as string)
        });

        revalidatePath("/dashboard/shares")

        return compose
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete compose");
    }
};