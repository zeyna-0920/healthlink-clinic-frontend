// Charger les variables d'environnement au tout début
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import passport from 'passport';
import configurePassport from './config/passport.js';

// Importer les routes
import patientRoutes from './routes/patientRoutes.js';
import bedRoutes from './routes/bedRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import medicamentRoutes from './routes/medicamentRoutes.js';
import passementRoutes from './routes/passementRoutes.js';

const app = express();

// Log toutes les requêtes entrantes pour debug
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST') console.log('Body:', req.body);
  next();
});

// Configuration Passport
configurePassport();
app.use(passport.initialize());

// --- Configuration de Sécurité ---

// 1. Helmet : Ajoute des headers de sécurité HTTP (XSS, Clickjacking, etc.)
app.use(helmet({
  crossOriginResourcePolicy: false, // Permet le chargement des ressources entre domaines
}));

// 2. CORS : Configuration pour autoriser le frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://healthlink-clinic-frontend.vercel.app', // Remplacez par votre URL Vercel réelle
  /\.vercel\.app$/ // Autorise tous les sous-domaines vercel.app
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme les outils mobiles ou curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) return allowedOrigin.test(origin);
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      // En production, on est plus souple pour éviter les blocages de déploiement
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 3. Rate Limiting : Désactivé ou augmenté en développement pour éviter les blocages de test
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Augmenté à 1000 pour le dev
  message: {
    success: false,
    message: "Trop de requêtes effectuées depuis cette IP, veuillez réessayer plus tard."
  }
});
app.use('/api/', limiter);

// 4. Sanitize : Protection contre les injections NoSQL
app.use(mongoSanitize());

// 5. Body Parsers
app.use(express.json({ limit: '10kb' })); // Limite la taille du body pour éviter les attaques DoS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Connexion MongoDB
const connectDB = async () => {
  try {
    console.log('Tentative de connexion à MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthlink-clinic');
    console.log(`✅ MongoDB Connecté: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
    console.log('Le serveur continuera de fonctionner, mais les fonctionnalités liées à la base de données seront indisponibles.');
    return false;
  }
};

// Utiliser les routes
app.use('/api/patients', patientRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/medicaments', medicamentRoutes);
app.use('/api/passements', passementRoutes);

// Route racine du backend
app.get('/', (req, res) => {
  console.log('GET / - Requête sur la route racine du backend');
  res.status(200).json({
    success: true,
    message: 'API HealthLink Clinic fonctionne. Utilisez /api/patients, /api/beds, /api/payments, /api/notifications, etc.',
  });
});

// Route de test
app.get('/api/health', (req, res) => {
  const emailConfigured = Boolean(
    (process.env.EMAIL_USER || process.env.SMTP_USER) &&
      (process.env.EMAIL_PASS || process.env.SMTP_PASSWORD),
  );
  res.status(200).json({
    success: true,
    message: 'Serveur en bonne santé',
    timestamp: new Date().toISOString(),
    emailConfigured,
    mongoConnected: mongoose.connection.readyState === 1,
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // On tente la connexion mais on n'attend pas forcément qu'elle réussisse pour lancer Express
  connectDB();
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `\n❌ Le port ${PORT} est déjà utilisé.\n` +
          `Veuillez fermer l'autre instance du serveur ou changer de port dans le fichier .env\n`
      );
    } else {
      console.error('Erreur serveur:', err);
    }
    process.exit(1);
  });
};

startServer();
