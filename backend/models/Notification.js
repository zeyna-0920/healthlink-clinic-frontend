import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: false, // Permet les notifications admin sans patientId spécifique
    },
    type: {
      type: String,
      enum: ['appointment_reminder', 'appointment_confirmed', 'appointment_request', 'payment_reminder', 'payment_successful', 'payment_failed', 'registration_complete', 'bed_assigned', 'bed_released', 'admin_alert'],
      required: true,
    },
    title: String,
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    channel: {
      type: String,
      enum: ['sms', 'email', 'in-app', 'whatsapp'],
      default: 'in-app',
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
