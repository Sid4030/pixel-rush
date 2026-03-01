import { connectDB } from "./db.js";
import { Registration } from "./registration.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
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
    const { name, email, course, phone, whatsapp } = req.body || {};

    if (!name || !email || !course) {
      return res
        .status(400)
        .json({ message: "Name, email, and course are required" });
    }

    const doc = await Registration.create({
      name,
      email,
      course,
      phone,
      whatsapp,
    });

    return res
      .status(201)
      .json({ message: "Registration successful", id: doc._id.toString() });
  } catch (error) {
    console.error("Registration API Error:", error);
    return res.status(500).json({
      message: "Internal server error during registration",
      details: error?.message ?? "Unknown error",
    });
  }
}

