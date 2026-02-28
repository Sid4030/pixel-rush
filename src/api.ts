import express from "express";
import mongoose from "mongoose";
import * as dotenv from 'dotenv';

dotenv.config();

export const apiRouter = express.Router();
apiRouter.use(express.json());

const RegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    course: { type: String, required: true },
    phone: { type: String },
    whatsapp: { type: String },
    created_at: { type: Date, default: Date.now }
});

const Registration = mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.warn("MONGODB_URI not set.");
        return;
    }
    try {
        await mongoose.connect(mongoURI);
        isConnected = true;
        console.log("MongoDB connected.");
    } catch (err) {
        console.error("MongoDB conn error:", err);
    }
};

// API Routes
apiRouter.post("/register", async (req, res) => {
    await connectDB();
    const { name, email, course, phone, whatsapp } = req.body;

    if (!name || !email || !course) {
        return res.status(400).json({ error: "Name, Email, and Course are required" });
    }

    try {
        const newRegistration = new Registration({ name, email, course, phone, whatsapp });
        const savedDoc = await newRegistration.save();
        res.json({ success: true, id: savedDoc._id });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to save registration" });
    }
});

apiRouter.post("/admin/login", (req, res) => {
    const { username, password } = req.body;

    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "pixeladmin2024";
    const apiKey = process.env.API_KEY || "fallback_api_key_123";

    if (username === validUsername && password === validPassword) {
        res.json({ success: true, token: apiKey });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

apiRouter.get("/registrations", async (req, res) => {
    await connectDB();
    const authHeader = req.headers.authorization;
    const apiKey = process.env.API_KEY || "fallback_api_key_123";

    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
        const docs = await Registration.find().sort({ created_at: -1 }).lean();
        const mappedDocs = docs.map((doc: any) => ({
            ...doc,
            id: doc._id.toString(),
        }));
        res.json(mappedDocs);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Failed to fetch registrations" });
    }
});
