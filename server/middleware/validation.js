// Middleware pour la validation des données
export const validatePatientRegistration = (req, res, next) => {
  const { firstName, lastName, email, phone, dateOfBirth, gender } = req.body;

  if (!firstName || !lastName || !email || !phone || !dateOfBirth || !gender) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs obligatoires doivent être remplis',
    });
  }

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Email invalide',
    });
  }

  // Validation du téléphone
  const phoneRegex = /^[0-9+\-\s()]*$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Numéro de téléphone invalide',
    });
  }

  next();
};

// Middleware pour la validation des rendez-vous
export const validateAppointment = (req, res, next) => {
  const { patientId, appointmentDate, appointmentTime, department, reason } = req.body;

  if (!patientId || !appointmentDate || !appointmentTime || !department || !reason) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs obligatoires doivent être remplis',
    });
  }

  const validDepartments = ['Urgence', 'Interne', 'Chirurgie', 'Maternité', 'Pédiatrie', 'UCI'];
  if (!validDepartments.includes(department)) {
    return res.status(400).json({
      success: false,
      message: 'Département invalide',
    });
  }

  next();
};

// Middleware pour la validation des paiements
export const validatePayment = (req, res, next) => {
  const { patientId, appointmentId, amount, paymentMethod } = req.body;

  if (!patientId || !appointmentId || !amount || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs obligatoires doivent être remplis',
    });
  }

  const validMethods = ['wave', 'orange_money', 'cash', 'credit_card'];
  if (!validMethods.includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: 'Méthode de paiement invalide',
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Le montant doit être positif',
    });
  }

  next();
};

// Middleware de gestion des erreurs
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Cette valeur existe déjà',
    });
  }

  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
  });
};
