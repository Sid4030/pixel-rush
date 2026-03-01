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
    const { teamName, participationType, sameClass, participant1, participant2, sharedClass } =
      req.body || {};

    if (!teamName || !participationType || !participant1) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (participationType !== "solo" && participationType !== "duo") {
      return res.status(400).json({ message: "Invalid participationType" });
    }

    const normalizeParticipant = (p, fallbackClass) => {
      const fullName = p?.fullName ?? p?.name;
      const base = {
        fullName,
        email: p?.email,
        phone: p?.phone,
        enrollmentNumber: p?.enrollmentNumber,
        batch: p?.batch ?? fallbackClass?.batch,
        degree: p?.degree ?? fallbackClass?.degree,
        course: p?.course ?? fallbackClass?.course,
        instituteName: p?.instituteName ?? fallbackClass?.instituteName,
      };
      return base;
    };

    const p1 = normalizeParticipant(participant1, sharedClass);
    const p2 = participationType === "duo" ? normalizeParticipant(participant2, sharedClass) : null;

    const isValidParticipant = (p) =>
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
      return res.status(400).json({ message: "Participant 1 is incomplete" });
    }

    if (participationType === "duo") {
      if (!participant2) {
        return res.status(400).json({ message: "Participant 2 is required for duo" });
      }
      if (sameClass) {
        if (
          !sharedClass ||
          !sharedClass.batch ||
          !sharedClass.degree ||
          !sharedClass.course ||
          !sharedClass.instituteName
        ) {
          return res.status(400).json({ message: "Shared class fields are required when sameClass is enabled" });
        }
      }
      if (!isValidParticipant(p2)) {
        return res.status(400).json({ message: "Participant 2 is incomplete" });
      }
    }

    const doc = await Registration.create({
      teamName,
      participationType,
      sameClass: Boolean(sameClass),
      participant1: p1,
      participant2: participationType === "duo" ? p2 : undefined,
      present: false,
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

