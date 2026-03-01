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
    const {
      name,
      email,
      phone,
      batch,
      enrollmentNumber,
      degree,
      course,
      instituteName,
      participationType,
    } = req.body || {};

    if (
      !name ||
      !email ||
      !phone ||
      !batch ||
      !enrollmentNumber ||
      !degree ||
      !course ||
      !instituteName ||
      !participationType
    ) {
      return res
        .status(400)
        .json({ message: "All registration fields are required" });
    }

    const doc = await Registration.create({
      name,
      email,
      phone,
      batch,
      enrollmentNumber,
      degree,
      course,
      instituteName,
      participationType,
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

