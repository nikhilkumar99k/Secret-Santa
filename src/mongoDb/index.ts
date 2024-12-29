import mongoose from "mongoose";

const uri = process.env.MONGO_URI as string;
console.log("Mongo db", uri)
export const connectToMongo = async () => {
        await mongoose.connect(uri)
        .then(async () => {
        console.log('Connected to MongoDB (Database 1)');
        })
        .catch((error:any) => {
        console.error('MongoDB connection error:', error);
        });
}