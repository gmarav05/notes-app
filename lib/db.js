import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URL

async function dbConnect() {
    try {
        const db = await mongoose.connect(MONGO_URI)
        console.log("ENV:", process.env.MONGODB_URL);

        console.log("Connected to mongodb", db)
    } catch (error) {
        console.error("Failed to connect to mongodb", error);
        throw error;
    }
}

export default dbConnect;