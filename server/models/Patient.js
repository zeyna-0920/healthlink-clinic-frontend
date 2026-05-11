import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['M', 'F', 'Autre'],
      required: true,
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
    bloodType: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    },
    medicalHistory: [String],
    allergies: [String],
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
    registrationDate: Date,
    lastConsultation: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);
