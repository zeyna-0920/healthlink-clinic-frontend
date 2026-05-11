import Notification from '../models/Notification.js';

// Récupérer toutes les notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({})
      .populate('patientId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer toutes les notifications d'un patient
export const getPatientNotifications = async (req, res) => {
  try {
    const { patientId } = req.params;
    const notifications = await Notification.find({ patientId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer les notifications non lues
export const getUnreadNotifications = async (req, res) => {
  try {
    const { patientId } = req.params;
    const notifications = await Notification.find({
      patientId,
      isRead: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Marquer une notification comme lue
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marquée comme lue',
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Marquer toutes les notifications comme lues
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { patientId } = req.params;

    await Notification.updateMany(
      { patientId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'Toutes les notifications marquées comme lues',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Créer une notification
export const createNotification = async (req, res) => {
  try {
    const { patientId, type, title, message, channel } = req.body;

    const notification = new Notification({
      patientId,
      type,
      title,
      message,
      channel: channel || 'in-app',
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification créée',
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Supprimer une notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification supprimée',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Obtenir les statistiques des notifications
export const getNotificationStatistics = async (req, res) => {
  try {
    const { patientId } = req.params;

    const total = await Notification.countDocuments({ patientId });
    const unread = await Notification.countDocuments({ patientId, isRead: false });
    const read = await Notification.countDocuments({ patientId, isRead: true });

    res.status(200).json({
      success: true,
      statistics: {
        total,
        unread,
        read,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
