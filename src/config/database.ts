import mongoose from "mongoose";
import { devLog } from "../utils/helpers";

export default async function connectDB() {
    let databaseUrl = "mongodb://localhost:27017/chatify";
    if (process.env.NODE_ENV === "production") {
        databaseUrl = process.env.DATABASE_URL as string;
    }
    try {
        devLog("Connecting to database...");
        await mongoose.connect(databaseUrl);
        devLog("Database connection successful");
    } catch (error) {
        console.error(error);
    }
}
