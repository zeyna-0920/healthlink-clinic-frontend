import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      enum: ['Urgence', 'Interne', 'Chirurgie', 'Maternité', 'Pédiatrie', 'UCI'],
    },
    doctorName: String,
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    notes: String,
    bedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bed',
      default: null,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ['wave', 'orange_money', 'cash', 'credit_card', null],
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
