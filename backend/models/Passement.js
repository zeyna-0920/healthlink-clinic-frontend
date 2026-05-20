import mongoose from 'mongoose';

const passementSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    nurseName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    careType: {
      type: String,
      required: true,
    },
    locationType: {
      type: String,
      enum: ['at_home', 'at_clinic'],
      required: true,
    },
    location: {
      type: String,
      // Only required if locationType is 'at_home'
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Passement', passementSchema);
