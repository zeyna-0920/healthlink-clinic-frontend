import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './models/Patient.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthlink-clinic');
    console.log('✅ Connecté à MongoDB');

    const adminEmail = "dienebat782@gmail.com";
    const adminPassword = "T2000@1970"; // Le mot de passe que vous aviez initialement

    // Vérifier si l'admin existe déjà
    let admin = await Patient.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin existant trouvé, mise à jour du mot de passe...');
      admin.password = adminPassword;
      await admin.save();
      console.log('✅ Mot de passe administrateur mis à jour avec succès');
    } else {
      console.log('Création d\'un nouvel administrateur...');
      admin = new Patient({
        firstName: "Admin",
        lastName: "Clinic",
        email: adminEmail,
        password: adminPassword,
        phone: "+221 00 000 00 00",
        dateOfBirth: new Date("1970-01-01"),
        gender: "F",
        address: {
          street: "Admin Street",
          city: "Dakar",
          postalCode: "12500",
          country: "Sénégal"
        }
      });
      await admin.save();
      console.log('✅ Administrateur créé avec succès');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur :', error);
    process.exit(1);
  }
};

createAdmin();
