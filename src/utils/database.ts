import mongoose from "mongoose";

let databaseUrl = "mongodb://localhost:27017/chatify";
if (process.env.NODE_ENV === "production") {
  databaseUrl = process.env.DATABASE_URL as string;
}

export default async function connectDB() {
  try {
    await mongoose.connect(databaseUrl);
    console.log("Database connection successful");
  } catch (error) {
    console.error(error);
  }
}
