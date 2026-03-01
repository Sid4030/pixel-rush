import { connectDB } from "../src/lib/db";
import { Registration } from "../src/models/Registration";

const INTERNAL_ADMIN_TOKEN = "pixel_rush_admin_secure_token_123";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({ error: "Failed to connect to database" });
  }

  const authHeader = req.headers?.authorization;
  if (!authHeader || authHeader !== `Bearer ${INTERNAL_ADMIN_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const docs = await Registration.find().sort({ created_at: -1 }).lean();
    const mappedDocs = docs.map((doc: any) => ({
      ...doc,
      id: doc._id.toString(),
    }));
    return res.status(200).json(mappedDocs);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Failed to fetch registrations" });
  }
}

