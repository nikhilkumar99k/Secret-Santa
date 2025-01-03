import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const uri = process.env.MONGO_URI as string;

export const connectToMongo = async () => {
  if (!uri) {
    throw new Error("MONGO_URI is not defined. Please check your .env file.");
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB (Database 1)");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Rethrow the error to handle it at a higher level
  }
};
