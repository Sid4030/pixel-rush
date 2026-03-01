import express from "express";
import * as dotenv from "dotenv";
import { connectDB } from "./lib/db";
import { Registration } from "./models/Registration";

dotenv.config();

export const apiRouter = express.Router();
apiRouter.use(express.json());

const INTERNAL_ADMIN_TOKEN = "pixel_rush_admin_secure_token_123";

apiRouter.post("/register", async (req, res) => {
  await connectDB();
  const { name, email, course, phone, whatsapp } = req.body;

  if (!name || !email || !course) {
    return res
      .status(400)
      .json({ error: "Name, Email, and Course are required" });
  }

  try {
    const newRegistration = new Registration({
      name,
      email,
      course,
      phone,
      whatsapp,
    });
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

  if (username === validUsername && password === validPassword) {
    res.json({ success: true, token: INTERNAL_ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

apiRouter.get("/registrations", async (req, res) => {
  await connectDB();
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${INTERNAL_ADMIN_TOKEN}`) {
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
