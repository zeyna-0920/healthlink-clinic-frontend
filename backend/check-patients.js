import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Patient from './models/Patient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkPatients() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const patients = await Patient.find({});
    console.log(`Nombre de patients: ${patients.length}`);
    patients.forEach(p => {
      console.log(`- ${p.firstName} ${p.lastName}: ${p.email}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
  }
}

checkPatients();
