import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const RegistrationSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  phone: { type: String },
  whatsapp: { type: String },
  created_at: { type: Date, default: Date.now },
});

export const Registration =
  models.Registration || model("Registration", RegistrationSchema);

