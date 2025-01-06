import { MongoClient } from "mongodb";

let uri = process.env.MONGODB_URI;
const options = {};

if (!process.env.MONGODB_URI) {
    uri="mongodb://root:root@mongodb:27017/mydatabase_for_test?authSource=admin"
    console.warn("MONGODB_URI IS NOT SET THE APP WONT WORK !!!")
}

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
        _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(uri || "", options);
    }
    client = globalWithMongo._mongoClient;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri || "", options);
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default client;