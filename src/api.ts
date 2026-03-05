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
  const {
    teamName,
    participationType,
    sameClass,
    participant1,
    participant2,
    sharedClass,
  } = req.body;

  if (
    !teamName ||
    !participationType ||
    !participant1
  ) {
    return res
      .status(400)
      .json({ error: "Missing required fields" });
  }

  if (participationType !== "solo" && participationType !== "duo") {
    return res.status(400).json({ error: "Invalid participationType" });
  }

  try {
    const normalizeParticipant = (p: any, fallbackClass: any) => {
      const fullName = p?.fullName || p?.name;
      return {
        fullName,
        email: p?.email,
        phone: p?.phone,
        enrollmentNumber: p?.enrollmentNumber,
        batch: p?.batch || fallbackClass?.batch,
        degree: p?.degree || fallbackClass?.degree,
        course: p?.course || fallbackClass?.course,
        instituteName: p?.instituteName || fallbackClass?.instituteName,
      };
    };

    const p1 = normalizeParticipant(participant1, sharedClass);
    const p2 = participationType === "duo" ? normalizeParticipant(participant2, sharedClass) : null;

    const isValidParticipant = (p: any) =>
      p &&
      p.fullName &&
      p.email &&
      p.phone &&
      p.enrollmentNumber &&
      p.batch &&
      p.degree &&
      p.course &&
      p.instituteName;

    if (!isValidParticipant(p1)) {
      return res.status(400).json({ error: "Participant 1 is incomplete" });
    }

    if (participationType === "duo") {
      if (!participant2) {
        return res.status(400).json({ error: "Participant 2 is required for duo" });
      }
      if (sameClass) {
        if (
          !sharedClass ||
          !sharedClass.batch ||
          !sharedClass.degree ||
          !sharedClass.course ||
          !sharedClass.instituteName
        ) {
          return res
            .status(400)
            .json({ error: "Shared class fields are required when sameClass is enabled" });
        }
      }
      if (!isValidParticipant(p2)) {
        return res.status(400).json({ error: "Participant 2 is incomplete" });
      }
    }

    const newRegistration = new Registration({
      teamName,
      participationType,
      sameClass: Boolean(sameClass),
      participant1: p1,
      participant2: participationType === "duo" ? p2 : undefined,
      present: false,
    });
    const savedDoc = await newRegistration.save();
    res.json({ success: true, id: savedDoc._id });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save registration" });
  }
});

apiRouter.post("/attendance", async (req, res) => {
  await connectDB();

  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${INTERNAL_ADMIN_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const { id, present } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const updated = await Registration.findByIdAndUpdate(
      id,
      { present: Boolean(present) },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: "Registration not found" });
    }

    res.json({ success: true, id, present: (updated as any).present });
  } catch (error) {
    console.error("Attendance update error:", error);
    res.status(500).json({ error: "Failed to update attendance" });
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
