import { connectDB } from "./db.js";
import { Registration } from "./registration.js";

const INTERNAL_ADMIN_TOKEN = "pixel_rush_admin_secure_token_123";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const authHeader = req.headers?.authorization;
  if (!authHeader || authHeader !== `Bearer ${INTERNAL_ADMIN_TOKEN}`) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    await connectDB();
  } catch (error) {
    console.error("DB connect error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error (db connect failed)" });
  }

  try {
    const docs = await Registration.find().sort({ created_at: -1 }).lean();
    const mappedDocs = docs.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
    }));
    return res.status(200).json(mappedDocs);
  } catch (error) {
    console.error("Fetch registrations API Error:", error);
    return res.status(500).json({
      message: "Internal server error while fetching registrations",
      details: error?.message ?? "Unknown error",
    });
  }
}

