import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './models/Patient.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const testAuth = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthlink-clinic');
    console.log('✅ Connecté à MongoDB');

    const testEmail = "test_" + Date.now() + "@example.com";
    const testPassword = "password123";

    console.log(`\n1. Test d'inscription pour ${testEmail}...`);
    const newPatient = new Patient({
      firstName: "Test",
      lastName: "User",
      email: testEmail,
      phone: "00000000",
      password: testPassword,
      dateOfBirth: new Date("1990-01-01"),
      gender: "M",
    });

    await newPatient.save();
    console.log('✅ Patient inscrit avec succès');

    console.log('\n2. Vérification du hachage dans la DB...');
    const savedPatient = await Patient.findOne({ email: testEmail }).select('+password');
    console.log('Mot de passe haché dans la DB:', savedPatient.password);
    
    const isHashed = savedPatient.password.startsWith('$2a$') || savedPatient.password.startsWith('$2b$');
    console.log('Est-ce haché bcrypt ?', isHashed);

    console.log('\n3. Test de comparaison de mot de passe...');
    const isValid = await savedPatient.comparePassword(testPassword);
    console.log('Comparaison avec le mot de passe original:', isValid ? 'VALIDE ✅' : 'INVALIDE ❌');

    const isInvalid = await savedPatient.comparePassword("wrong_password");
    console.log('Comparaison avec un mauvais mot de passe:', isInvalid ? 'VALIDE ❌' : 'INVALIDE ✅');

    // Nettoyage
    await Patient.deleteOne({ email: testEmail });
    console.log('\n✅ Test terminé. Suppression du patient de test.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur :', error);
    process.exit(1);
  }
};

testAuth();
