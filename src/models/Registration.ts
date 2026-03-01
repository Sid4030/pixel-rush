import mongoose, { Schema, Model, Document } from "mongoose";

export interface IRegistration extends Document {
  name: string;
  email: string;
  phone: string;
  batch: string;
  enrollmentNumber: string;
  degree: string;
  course: string;
  instituteName: string;
  participationType: string;
  created_at: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
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

export const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

