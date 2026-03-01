import mongoose, { Schema, Model, Document } from "mongoose";

export interface IRegistration extends Document {
  name: string;
  email: string;
  course: string;
  phone?: string;
  whatsapp?: string;
  created_at: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  phone: { type: String },
  whatsapp: { type: String },
  created_at: { type: Date, default: Date.now },
});

export const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

