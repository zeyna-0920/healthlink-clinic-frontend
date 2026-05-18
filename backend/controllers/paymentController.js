import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import Appointment from '../models/Appointment.js';

// Créer un paiement
export const createPayment = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      amount,
      paymentMethod,
      phoneNumber,
      description,
    } = req.body;

    if (!['wave', 'orange_money', 'cash', 'credit_card'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Méthode de paiement invalide' });
    }

    const payment = new Payment({
      patientId,
      appointmentId,
      amount,
      paymentMethod,
      phoneNumber,
      description,
      status: 'pending',
    });

    await payment.save();

    // Créer une notification de rappel de paiement
    await Notification.create({
      patientId,
      type: 'payment_reminder',
      title: 'Paiement en attente',
      message: `Un paiement de ${amount} XOF est en attente pour votre rendez-vous`,
      relatedId: payment._id,
    });

    res.status(201).json({
      success: true,
      message: 'Paiement créé',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Initier un paiement Wave
export const initiateWavePayment = async (req, res) => {
  try {
    const { paymentId, phoneNumber, amount } = req.body;

    // Note: Ceci est un exemple. Intégrez l'API Wave réelle ici
    // const waveResponse = await callWaveAPI(phoneNumber, amount);

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { 
        phoneNumber,
        transactionId: `WAVE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Paiement Wave initié',
      payment,
      nextStep: 'Veuillez confirmer sur votre téléphone Wave',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Initier un paiement Orange Money
export const initiateOrangeMoneyPayment = async (req, res) => {
  try {
    const { paymentId, phoneNumber, amount } = req.body;

    // Note: Ceci est un exemple. Intégrez l'API Orange Money réelle ici
    // const orangeResponse = await callOrangeMoneyAPI(phoneNumber, amount);

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        phoneNumber,
        transactionId: `OM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Paiement Orange Money initié',
      payment,
      nextStep: 'Veuillez confirmer sur votre téléphone Orange Money',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Confirmer un paiement
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId, reference } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'completed',
        paymentDate: new Date(),
        reference,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    // Mettre à jour le statut du rendez-vous
    if (payment.appointmentId) {
      await Appointment.findByIdAndUpdate(payment.appointmentId, {
        isPaid: true,
        paymentMethod: payment.paymentMethod,
      });
    }

    // Créer une notification de paiement réussi
    await Notification.create({
      patientId: payment.patientId,
      type: 'payment_successful',
      title: 'Paiement réussi',
      message: `Un paiement de ${payment.amount} XOF a été traité`,
      relatedId: paymentId,
    });

    res.status(200).json({
      success: true,
      message: 'Paiement confirmé',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Échouer un paiement
export const failPayment = async (req, res) => {
  try {
    const { paymentId, failureReason } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'failed',
        failureReason,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    // Créer une notification d'échec de paiement
    await Notification.create({
      patientId: payment.patientId,
      type: 'payment_failed',
      title: 'Paiement échoué',
      message: `Votre paiement a échoué: ${failureReason}`,
      relatedId: paymentId,
    });

    res.status(200).json({
      success: true,
      message: 'Paiement marqué comme échoué',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer les paiements d'un patient
export const getPatientPayments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const payments = await Payment.find({ patientId })
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer tous les paiements
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('patientId', 'firstName lastName email')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer les statistiques de paiement
export const getPaymentStatistics = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const completedPayments = await Payment.countDocuments({ status: 'completed' });
    const failedPayments = await Payment.countDocuments({ status: 'failed' });
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });

    const totalAmount = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalPayments,
        completedPayments,
        failedPayments,
        pendingPayments,
        totalAmount: totalAmount[0]?.total || 0,
        successRate: ((completedPayments / totalPayments) * 100).toFixed(2) + '%',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
