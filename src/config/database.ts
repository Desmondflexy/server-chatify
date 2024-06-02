import mongoose from "mongoose";

export default async function connectDB() {
  let databaseUrl = "mongodb://localhost:27017/chatify";
  if (process.env.NODE_ENV === "production") {
    databaseUrl = process.env.DATABASE_URL as string;
  }
  try {
    console.log("Connecting to database...");
    await mongoose.connect(databaseUrl);
    console.log("Database connection successful");
  } catch (error) {
    console.error(error);
  }
}
