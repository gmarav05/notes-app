import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URL

let isConnected = false;

async function dbConnect() {

    if (isConnected) {
        console.log("Already connected to mongodb");
    }

    try {
        const db = await mongoose.connect(MONGO_URI)
        isConnected = db.connections[0].readyState === 1;
        console.log("ENV:", process.env.MONGODB_URL);

        console.log("Connected to mongodb", db)
    } catch (error) {
        console.error("Failed to connect to mongodb", error);
        throw error;
    }
}

export default dbConnect;