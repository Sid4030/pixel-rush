import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn("MONGODB_URI not set.");
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("MongoDB connected (serverless).");
  } catch (err) {
    console.error("MongoDB connection error (serverless):", err);
    throw err;
  }
}

