import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';

/**
 * Middleware pour protéger les routes et vérifier le token JWT
 */
export const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extraire le token
      token = req.headers.authorization.split(' ')[1];

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt_tres_long_et_sur');

      // Ajouter l'utilisateur à la requête (sans le mot de passe)
      req.user = await Patient.findById(decoded.id).select('-password');
      
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: 'Non autorisé, token invalide'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé, aucun token fourni'
    });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est admin
 */
export const admin = (req, res, next) => {
  // Pour ce projet, on peut considérer que l'email spécifique est l'admin
  const adminEmail = "dienebat782@gmail.com";
  
  if (req.user && req.user.email === adminEmail) {
    return next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé, droits administrateur requis'
    });
  }
};
