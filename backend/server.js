import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Utiliser les routes
app.use('/api/patients', patientRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/medicaments', medicamentRoutes);

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
