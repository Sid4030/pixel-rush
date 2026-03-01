import { connectDB } from "./db.js";
import { Registration } from "./registration.js";

const INTERNAL_ADMIN_TOKEN = "pixel_rush_admin_secure_token_123";

export default async function handler(req, res) {
  if (req.method !== "POST") {
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
    const { id, present } = req.body || {};
    if (!id) {
      return res.status(400).json({ message: "Missing id" });
    }

    const updated = await Registration.findByIdAndUpdate(
      id,
      { present: Boolean(present) },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: "Registration not found" });
    }

    return res.status(200).json({ success: true, id, present: updated.present });
  } catch (error) {
    console.error("Attendance update error:", error);
    return res.status(500).json({
      message: "Internal server error updating attendance",
      details: error?.message ?? "Unknown error",
    });
  }
}

