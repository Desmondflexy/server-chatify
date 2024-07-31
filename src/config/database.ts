import mongoose from "mongoose";
import { devLog } from "../utils/helpers";

export default async function connectDB() {
    let databaseUrl;
    if (process.env.NODE_ENV === "production")
        databaseUrl = process.env.DATABASE_URL as string;
    else if (process.env.NODE_ENV === "staging")
        databaseUrl = process.env.DATABASE_URL_TEST as string;
    else databaseUrl = "mongodb://localhost:27017/chatify";

    try {
        await mongoose.connect(databaseUrl);
        devLog("Database connection successful");
    } catch (error) {
        console.error(error);
    }
}
