import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'XOF', // Francs CFA Ouest-Africain
    },
    paymentMethod: {
      type: String,
      enum: ['wave', 'orange_money', 'cash', 'credit_card'],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentDate: Date,
    description: String,
    phoneNumber: String, // Pour Wave et Orange Money
    reference: String, // Référence d'appel Wave/Orange Money
    failureReason: String,
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
