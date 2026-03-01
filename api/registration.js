import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const RegistrationSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  batch: { type: String, required: true },
  enrollmentNumber: { type: String, required: true },
  degree: { type: String, required: true },
  course: { type: String, required: true },
  instituteName: { type: String, required: true },
  participationType: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const Registration =
  models.Registration || model("Registration", RegistrationSchema);

