import { connectDB } from "./_db";
import { Registration } from "./_registration";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({ error: "Failed to connect to database" });
  }

  const { name, email, course, phone, whatsapp } = req.body || {};

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
    return res.status(200).json({ success: true, id: savedDoc._id });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Failed to save registration" });
  }
}

