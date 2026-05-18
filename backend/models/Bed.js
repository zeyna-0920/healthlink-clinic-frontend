import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: true,
      unique: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      enum: ['Urgence', 'Interne', 'Chirurgie', 'Maternité', 'Pédiatrie', 'UCI'],
    },
    capacity: {
      type: Number,
      default: 1,
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    currentPatient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },
    checkInDate: Date,
    checkOutDate: Date,
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance', 'reserved'],
      default: 'available',
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Bed', bedSchema);
