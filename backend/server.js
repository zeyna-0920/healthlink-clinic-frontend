import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

// Charger les variables d'environnement
dotenv.config();

const app = express();

// --- Configuration de Sécurité ---

// 1. Helmet : Ajoute des headers de sécurité HTTP (XSS, Clickjacking, etc.)
app.use(helmet());

// 2. CORS : Configuration plus restrictive
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 3. Rate Limiting : Limite le nombre de requêtes par IP pour éviter les attaques brute-force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
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
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthlink-clinic', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Importer les routes
import patientRoutes from './routes/patientRoutes.js';
import bedRoutes from './routes/bedRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import medicamentRoutes from './routes/medicamentRoutes.js';
import passementRoutes from './routes/passementRoutes.js';

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
  res.status(200).json({
    success: true,
    message: 'API HealthLink Clinic fonctionne. Utilisez /api/patients, /api/beds, /api/payments, /api/notifications, etc.',
  });
});

// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Serveur en bonne santé',
    timestamp: new Date().toISOString(),
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
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `\nLe port ${PORT} est déjà utilisé (EADDRINUSE).\n` +
            `Fermez l’autre terminal qui lance le backend, ou tuez le processus Node concerné, ou utilisez un autre port :\n` +
            `  PowerShell : Get-NetTCPConnection -LocalPort ${PORT} | Select OwningProcess\n` +
            `  puis : Stop-Process -Id <PID> -Force\n` +
            `  ou : set PORT=5001 && npm run dev\n`
        );
      } else {
        console.error(err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error(`Erreur lors du démarrage du serveur: ${error.message}`);
    process.exit(1);
  }
};

startServer();
