import mongoose, { Schema, Model, Document } from "mongoose";

export interface IParticipant {
  fullName: string;
  email: string;
  phone: string;
  enrollmentNumber: string;
  batch: string;
  degree: string;
  course: string;
  instituteName: string;
}

export interface IRegistration extends Document {
  teamName: string;
  participationType: "solo" | "duo";
  sameClass: boolean;
  participant1: IParticipant;
  participant2?: IParticipant;
  present: boolean;
  created_at: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
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

const RegistrationSchema = new Schema<IRegistration>({
  teamName: { type: String, required: true },
  participationType: { type: String, required: true, enum: ["solo", "duo"] },
  sameClass: { type: Boolean, default: false },
  participant1: { type: ParticipantSchema, required: true },
  participant2: { type: ParticipantSchema, required: false },
  present: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

export const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

