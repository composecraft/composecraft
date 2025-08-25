'use server'

import client from "@/lib/mongodb"
import {z} from "zod";
import {zfd} from "zod-form-data";
import {actionClient, PassToClientError} from "@/lib/safe-action";
import bcrypt from "bcryptjs";
import {registerUserToBrevo, sendRecoverPassdEmail, updateUserList} from "@/lib/brevo";
import {cookies} from 'next/headers'
import {redirect} from "next/navigation";
import {SignJWT} from "jose";
import {ObjectId} from "bson";
import {composeMetadata} from "@/lib/metadata";
import {revalidatePath} from "next/cache";
import {ensureAuth} from "@/lib/auth";
import {generateRandomString, isWithinOneDay} from "@/lib/utils";
// @ts-ignore
import { Base64UrlDecoder } from 'next-base64-encoder';

const registerSchema = zfd.formData({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    company: z.string(),
    terms: z.string(),
    data: z.optional(z.string())
})

export async function createOrLoginUser(email:string,data:any):Promise<string>{
    await client.connect()
    const db = client.db("compose_craft")
    const collection = db.collection("users")
    const userExist = await collection.findOne({email: email})
    const secretKey = process.env.SECRET_KEY
    if (userExist) {
        const token = await new SignJWT({userId: userExist._id, email:userExist.email})
            .setProtectedHeader({alg: 'HS256'}) // Algorithm for signing the JWT
            .setExpirationTime('31d') // Set the expiration time to 31 days
            .sign(new TextEncoder().encode(secretKey)); // Sign the JWT with the secret key

        // Set the JWT token in an HTTP-only cookie
        (await cookies()).set({
            name: "token",
            value: token,
            httpOnly: true,
            path: "/",
            expires: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
        })

        return userExist._id.toString()
    }
    const result = await collection.insertOne({email: email, ...data, createdAt: new Date().getTime()});
    if (!secretKey) {
        throw new Error("error on our admin system")
    }
    if (result.insertedId) {
        const token = await new SignJWT({userId: result.insertedId, email:email})
            .setProtectedHeader({alg: 'HS256'}) // Algorithm for signing the JWT
            .setExpirationTime('31d') // Set the expiration time to 31 days
            .sign(new TextEncoder().encode(secretKey)); // Sign the JWT with the secret key

        // Set the JWT token in an HTTP-only cookie
        (await cookies()).set({
            name: "token",
            value: token,
            httpOnly: true,
            path: "/"
        })

        return result.insertedId.toString()
    }
    return ""
}

export const registerUser = actionClient
    .schema(registerSchema)
    .action(async ({parsedInput: {email, password, company, terms,data}}) => {
        if(process.env.DISABLE_SIGNUP){
            console.error("Signup is disabled")
            throw new PassToClientError("Signup is disabled")
        }
        // eslint-disable-next-line no-useless-catch
        try {
            await client.connect()
            const hashedPassword = await bcrypt.hash(password, 10);
            const brevoId = await registerUserToBrevo({email: email})
            const user = {
                email: email,
                password: hashedPassword,
                companyType: company,
                termsAccepted: !!terms,
                brevoId: brevoId
            }
            await createOrLoginUser(user.email,user)
            if(data){
                const byteArrayPhrase = new TextEncoder().encode(data);
                const base64UrlDecoder = new Base64UrlDecoder();
                const base64UrlPhrase = base64UrlDecoder.decode(byteArrayPhrase);
                redirect("/dashboard/playground?data="+base64UrlPhrase)
            }
            return true
        } catch (e) {
            throw e;
        }
    })


export const registerCompose = async (compose: object,metadata:composeMetadata, id?: string | undefined) => {
    const payload = await ensureAuth()
    await client.connect()
    const db = client.db("compose_craft")
    const user_collection = db.collection("users")
    const userId = new ObjectId(payload.userId as string);
    const user = await user_collection.findOne({_id: userId});
    const collection = db.collection("composes")
    let result = ""
    if (id) {
        console.debug('update document')
        // Update existing document
        const objectId = new ObjectId(id); // Convert `id` to ObjectId
        const updateResult = await collection.updateOne(
            {_id: objectId},               // Filter by document ID
            {
                $set: {
                    data: compose,
                    metadata: metadata,
                    updatedAt: Date.now()
                }
            } // Fields to update
        );
        if (updateResult.matchedCount > 0) {
            result = objectId.toString();
        } else {
            throw new Error("Could not update document");
        }
    } else {
        console.debug('create document')
        const r = await collection.insertOne({
            userId: user?._id,
            data: compose,
            metadata: metadata,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        result = r.insertedId.toString()
    }
    if (result) {
        return result
    } else {
        throw Error("could not register")
    }
};

export const registerComposeWithoutMetadata = async (compose: object,userId:ObjectId) => {
    await client.connect()
    const db = client.db("compose_craft")
    const user_collection = db.collection("users")
    const user = await user_collection.findOne({_id: userId});
    const collection = db.collection("composes")
    let result = ""
    const r = await collection.insertOne({
            userId: user?._id,
            data: compose,
            metadata: null,
            createdAt: Date.now(),
            updatedAt: Date.now()});
    result = r.insertedId.toString()
    if (result) {
        return result
    } else {
        throw Error("could not register")
    }
};

export const getAllMyComposeOrderByEditDate = async () => {
    const payload = await ensureAuth()

    const cli = await client.connect();
    const db = cli.db("compose_craft");
    const collection = db.collection("composes");

    // Convert user ID from JWT payload to ObjectId
    const userId = new ObjectId(payload.userId as string);

    try {
        // Find all documents for the user, sort by updatedAt in descending order
        const composes = await collection
            .find({userId: userId})
            .sort({updatedAt: -1})
            .toArray();

        return composes.map(compose => ({
            id: compose._id.toString(),
            data: compose.data,
            createdAt: compose.createdAt,
            updatedAt: compose.updatedAt
        }));
    } catch (error) {
        console.error(error)
        throw new Error("Failed to fetch composes");
    }
};

const loginSchema = zfd.formData({
    email: z.string().email(),
    password: z.string().min(6).max(100)
})

export const loginUser = actionClient
    .schema(loginSchema)
    .action(async ({parsedInput: {email, password}}) => {
        // eslint-disable-next-line no-useless-catch
        try {
            await client.connect()
            const db = client.db("compose_craft")

            // Find the user in the database by email
            const collection = db.collection("users")
            const user = await collection.findOne({email: email});

            // If the user doesn't exist, throw an error
            if (!user) {
                throw new Error("Invalid email or password");
            }

            // Compare the hashed password with the input password
            const passwordMatch = await bcrypt.compare(password, user.password);

            // If the password doesn't match, throw an error
            if (!passwordMatch) {
                throw new Error("Invalid email or password");
            }

            const secretKey = process.env.SECRET_KEY
            if (!secretKey) {
                return {failure: "error on our admin system"}
            }

            // Generate a JWT token upon successful login
            const token = await new SignJWT({userId: user._id, email: user.email})
                .setProtectedHeader({alg: 'HS256'})
                .setExpirationTime('31d') // Set token expiration to 31 days
                .sign(new TextEncoder().encode(secretKey));

            // Set the JWT token in an HTTP-only cookie
            (await cookies()).set({
                name: "token",
                expires: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
                value: token,
                httpOnly: true,
                path: "/"
            })

            // Redirect to the dashboard after successful login
            redirect("/dashboard")

        } catch (e) {
            throw e;
        }
    })

export async function getApiToken(email:string,password:string):Promise<string>{
    // eslint-disable-next-line no-useless-catch
    try {
        await client.connect()
        const db = client.db("compose_craft")

        // Find the user in the database by email
        const collection = db.collection("users")
        const user = await collection.findOne({email: email});

        // If the user doesn't exist, throw an error
        if (!user) {
            throw new Error("Invalid email or password");
        }

        // Compare the hashed password with the input password
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If the password doesn't match, throw an error
        if (!passwordMatch) {
            throw new Error("Invalid email or password");
        }

        const secretKey = process.env.SECRET_KEY
        if (!secretKey) {
            throw new Error("error on our admin system")
        }

        // Generate a JWT token upon successful login
        const token = await new SignJWT({userId: user._id, email: user.email})
            .setProtectedHeader({alg: 'HS256'})
            .setExpirationTime('31d') // Set token expiration to 31 days
            .sign(new TextEncoder().encode(secretKey));

        return token.toString()
    } catch (e) {
        throw e;
    }
}

export const getComposeById = async (composeId: string) => {
    const payload = await ensureAuth()

    await client.connect();
    const db = client.db("compose_craft");
    const collection = db.collection("composes");

    // Convert user ID from JWT payload and compose ID to ObjectId
    const userId = new ObjectId(payload.userId as string);

    try {
        // Convert the composeId string to ObjectId
        const compose = await collection.findOne({
            _id: new ObjectId(composeId),
            userId: userId  // Ensure the compose belongs to the authenticated user
        });

        // Return undefined if no compose is found
        if (!compose) {
            return undefined;
        }

        // Return the formatted compose data
        return {
            id: compose._id.toString(),
            data: compose.data,
            metadata: compose?.metadata,
            createdAt: compose.createdAt,
            updatedAt: compose.updatedAt
        };
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch compose");
    }
};

export const getMyInfos = async () => {
    const payload = await ensureAuth()

    await client.connect();
    const db = client.db("compose_craft");
    const collection = db.collection("users");

    // Convert user ID from JWT payload and compose ID to ObjectId
    const userId = new ObjectId(payload.userId as string);

    try {
        const user = await collection.findOne({
            _id: userId
            },{ projection: { email: 1 }
        });

        if (!user) {
            return undefined;
        }

        return {
            email: user.email
        }
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch compose");
    }
};

export const deleteUser = async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            await client.connect();
            const db = client.db("compose_craft");

            // Find the user in the database by email from the cookie
            const payload = await ensureAuth()
            const userId = new ObjectId(payload.userId as string);

            const userCollection = db.collection("users");

            // Set all the user's compose userId to null
            const composeCollection = db.collection("composes");
            await composeCollection.updateMany(
                { userId: userId },
                { $set: { userId: null } }
            );

            const user = await userCollection.findOne({
                _id: userId
            },{ projection: { email: 1 }
            });

            if (user?.email) {
                await updateUserList(user.email,[],[9])
            }

            // Delete the user from the database
            await userCollection.deleteOne({ _id: userId });
            (await cookies()).delete("token")
            console.log("account " + userId.toString() + " deleted")
            redirect("https://form.composecraft.com/s/cm40i9zod000hwl0z6005uvwp")
        } catch (e) {
            throw e;
        }
}

export const logout = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        await client.connect();
        (await cookies()).delete("token")
        redirect("/")
    } catch (e) {
        throw e;
    }
}

export const deleteCompose = async (composeId:string) => {
    // eslint-disable-next-line no-useless-catch
    try {
        await client.connect();
        const db = client.db("compose_craft");
        const payload = await ensureAuth()

        // Set all the user's compose userId to null
        const composeCollection = db.collection("composes");
        await composeCollection.deleteOne({
            _id: new ObjectId(composeId),
            userId: new ObjectId(payload.userId as string)
        })

        revalidatePath("/dashboard","page")
        return true
    } catch (e) {
        throw e;
    }
}

const passwordAskSchema = zfd.formData({
    email: z.string().email(),
})

export const askPasswordReset = actionClient
    .schema(passwordAskSchema)
    .action(async ({parsedInput: {email}}) => {
        // eslint-disable-next-line no-useless-catch
        try {
            await client.connect()
            const db = client.db("compose_craft")

            // Find the user in the database by email
            const collection = db.collection("users")
            const user = await collection.findOne({email: email});

            if(!user){
                throw new Error("This email is not associated with any account")
            }else{
                const code = generateRandomString()
                const code_collec = db.collection("reset_code")
                const inserted = await code_collec.insertOne({
                    code : code,
                    type: email,
                    createdAt: new Date().getTime(),
                    userId: user._id
                })
                if(inserted){
                    sendRecoverPassdEmail(email,code)
                    return true
                }
                else{
                    throw new Error("server side error")
                }
            }
        } catch (e) {
            throw e;
        }
    })

const passwordResetSchema = zfd.formData({
    password: z.string().min(5,"Password length > 6"),
    password2: z.string(),
    code: z.string(),
})

export const passwordReset = actionClient
    .schema(passwordResetSchema)
    .action(async ({parsedInput: {password, password2,code}}) => {
        if(password !== password2){
            throw new PassToClientError("Passwords are not the sames")
        }
        try{
            await client.connect()
            const db = client.db("compose_craft")
            const code_collec = db.collection("reset_code")
            const resetCode = await code_collec.findOne({code:code})
            if(!resetCode){
                throw new PassToClientError("The code is invalid")
            }
            if(!isWithinOneDay(Number(resetCode?.createdAt),new Date().getTime())){
                throw new PassToClientError("The code is outdated")
            }

            //here everything has been checked
            await code_collec.deleteOne({code:code})
            const user_collec = db.collection("users")
            const hashedPassword = await bcrypt.hash(password, 10);
            const res = await user_collec.updateOne({_id : resetCode.userId},{
                $set:{password: hashedPassword}
            })
            if(res){
                return
            }
            throw new PassToClientError("Can't change password for unknown reason, server error")
        }catch (e){
            console.error(e)
            if(e instanceof PassToClientError){
                throw e
            }
        }
    })