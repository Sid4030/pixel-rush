import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const ParticipantSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    enrollmentNumber: { type: String, required: true },
    batch: { type: String, required: true },
    degree: { type: String, required: true },
    course: { type: String, required: true },
    instituteName: { type: String, required: true },
  },
  { _id: false }
);

const RegistrationSchema = new Schema({
  teamName: { type: String, required: true },
  participationType: { type: String, required: true, enum: ["solo", "duo"] },

  sameClass: { type: Boolean, default: false },

  participant1: { type: ParticipantSchema, required: true },
  participant2: { type: ParticipantSchema, required: false },

  present: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

export const Registration =
  models.Registration || model("Registration", RegistrationSchema);

