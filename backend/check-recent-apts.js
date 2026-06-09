import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Appointment from './models/Appointment.js';
import Patient from './models/Patient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkRecentAppointments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const appointments = await Appointment.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('patientId');
    
    console.log(`\n--- 5 derniers rendez-vous ---`);
    if (appointments.length === 0) {
      console.log('Aucun rendez-vous trouvé.');
    } else {
      appointments.forEach((apt, i) => {
        console.log(`\n[${i+1}] ID: ${apt._id}`);
        console.log(`Patient: ${apt.patientId ? apt.patientId.firstName + ' ' + apt.patientId.lastName : 'Inconnu'}`);
        console.log(`Email Patient: ${apt.patientId ? apt.patientId.email : 'N/A'}`);
        console.log(`Date RV: ${apt.appointmentDate}`);
        console.log(`Status: ${apt.status}`);
        console.log(`Créé le: ${apt.createdAt}`);
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
  }
}

checkRecentAppointments();
