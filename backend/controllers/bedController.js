import Bed from '../models/Bed.js';
import Notification from '../models/Notification.js';

// Créer un nouveau lit
export const createBed = async (req, res) => {
  try {
    const { bedNumber, roomNumber, department, capacity } = req.body;

    const bed = new Bed({
      bedNumber,
      roomNumber,
      department,
      capacity: capacity || 1,
      status: 'available',
    });

    await bed.save();

    res.status(201).json({
      success: true,
      message: 'Lit créé avec succès',
      bed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer tous les lits disponibles
export const getAvailableBeds = async (req, res) => {
  try {
    const beds = await Bed.find({ status: 'available' }).populate('currentPatient');

    res.status(200).json({
      success: true,
      totalAvailable: beds.length,
      beds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer les lits par département
export const getBedsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const beds = await Bed.find({ department }).populate('currentPatient');

    res.status(200).json({
      success: true,
      department,
      total: beds.length,
      beds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Obtenir le nombre total de lits et lits occupés
export const getBedStatistics = async (req, res) => {
  try {
    const totalBeds = await Bed.countDocuments();
    const occupiedBeds = await Bed.countDocuments({ status: 'occupied' });
    const availableBeds = await Bed.countDocuments({ status: 'available' });
    const maintenanceBeds = await Bed.countDocuments({ status: 'maintenance' });

    res.status(200).json({
      success: true,
      statistics: {
        totalBeds,
        occupiedBeds,
        availableBeds,
        maintenanceBeds,
        occupancyRate: ((occupiedBeds / totalBeds) * 100).toFixed(2) + '%',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Assigner un patient à un lit
export const assignPatientToBed = async (req, res) => {
  try {
    const { bedId, patientId } = req.body;

    const bed = await Bed.findById(bedId);
    if (!bed) {
      return res.status(404).json({ message: 'Lit non trouvé' });
    }

    if (bed.status !== 'available') {
      return res.status(400).json({ message: 'Ce lit n\'est pas disponible' });
    }

    bed.currentPatient = patientId;
    bed.isOccupied = true;
    bed.status = 'occupied';
    bed.checkInDate = new Date();

    await bed.save();

    // Créer une notification
    await Notification.create({
      patientId,
      type: 'bed_assigned',
      title: 'Lit assigné',
      message: `Vous avez été assigné au lit ${bed.bedNumber}`,
      relatedId: bedId,
    });

    res.status(200).json({
      success: true,
      message: 'Patient assigné au lit',
      bed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Libérer un lit
export const releaseBed = async (req, res) => {
  try {
    const { bedId } = req.params;

    const bed = await Bed.findById(bedId);
    if (!bed) {
      return res.status(404).json({ message: 'Lit non trouvé' });
    }

    const patientId = bed.currentPatient;

    bed.currentPatient = null;
    bed.isOccupied = false;
    bed.status = 'available';
    bed.checkOutDate = new Date();

    await bed.save();

    // Créer une notification
    if (patientId) {
      await Notification.create({
        patientId,
        type: 'bed_released',
        title: 'Lit libéré',
        message: 'Votre lit a été libéré',
        relatedId: bedId,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lit libéré',
      bed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mettre en maintenance un lit
export const setBedMaintenance = async (req, res) => {
  try {
    const { bedId } = req.params;
    const { notes } = req.body;

    const bed = await Bed.findByIdAndUpdate(
      bedId,
      { status: 'maintenance', notes },
      { new: true }
    );

    if (!bed) {
      return res.status(404).json({ message: 'Lit non trouvé' });
    }

    res.status(200).json({
      success: true,
      message: 'Lit en maintenance',
      bed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer tous les lits
export const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find().populate('currentPatient');

    res.status(200).json({
      success: true,
      total: beds.length,
      beds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
