import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicament from './models/Medicament.js';
import Patient from './models/Patient.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB pour vérification');

    const medCount = await Medicament.countDocuments();
    const patientCount = await Patient.countDocuments();
    const apptCount = await Appointment.countDocuments();

    console.log(`📊 Statistiques de la base de données :`);
    console.log(`- Médicaments : ${medCount}`);
    console.log(`- Patients : ${patientCount}`);
    console.log(`- Rendez-vous : ${apptCount}`);

    if (medCount === 0) {
      console.log('⚠️ Attention : Aucun médicament trouvé. Vous devriez lancer "npm run seed" dans le dossier backend.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la vérification :', error);
    process.exit(1);
  }
};

checkDB();
