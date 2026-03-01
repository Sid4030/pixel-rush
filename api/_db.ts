import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn("MONGODB_URI not set.");
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("MongoDB connected (serverless).");
  } catch (err) {
    console.error("MongoDB connection error (serverless):", err);
    throw err;
  }
};

