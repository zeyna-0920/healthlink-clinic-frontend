import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './models/Patient.js';
import Bed from './models/Bed.js';
import Appointment from './models/Appointment.js';
import Payment from './models/Payment.js';
import Notification from './models/Notification.js';

// Charger les variables d'environnement
dotenv.config();

const patientsInitiaux = [
  {
    firstName: "Fatou",
    lastName: "Diallo",
    email: "fatou.diallo@email.com",
    phone: "+221 77 123 45 67",
    password: "demo1234",
    dateOfBirth: new Date("1985-03-15"),
    gender: "F",
    address: {
      street: "123 Rue de la Médina",
      city: "Dakar",
      postalCode: "12500",
      country: "Sénégal"
    },
    bloodType: "O+",
    medicalHistory: ["Hypertension", "Diabète type 2"],
    allergies: ["Pénicilline"],
    emergencyContact: {
      name: "Mamadou Diallo",
      phone: "+221 77 987 65 43",
      relationship: "Frère"
    }
  },
  {
    firstName: "Amadou",
    lastName: "Sow",
    email: "amadou.sow@email.com",
    phone: "+221 76 234 56 78",
    password: "demo1234",
    dateOfBirth: new Date("1990-07-22"),
    gender: "M",
    address: {
      street: "456 Avenue Léopold Sédar Senghor",
      city: "Dakar",
      postalCode: "12500",
      country: "Sénégal"
    },
    bloodType: "A+",
    medicalHistory: ["Asthme"],
    allergies: ["Aspirine"],
    emergencyContact: {
      name: "Aïssatou Sow",
      phone: "+221 76 543 21 09",
      relationship: "Épouse"
    }
  },
  {
    firstName: "Mariama",
    lastName: "Ba",
    email: "mariama.ba@email.com",
    phone: "+221 78 345 67 89",
    password: "demo1234",
    dateOfBirth: new Date("1978-11-08"),
    gender: "F",
    address: {
      street: "789 Boulevard de la République",
      city: "Saint-Louis",
      postalCode: "32000",
      country: "Sénégal"
    },
    bloodType: "B+",
    medicalHistory: ["Arthrite"],
    allergies: [],
    emergencyContact: {
      name: "Ousmane Ba",
      phone: "+221 78 876 54 32",
      relationship: "Mari"
    }
  },
  {
    firstName: "Ibrahima",
    lastName: "Ndiaye",
    email: "ibrahima.ndiaye@email.com",
    phone: "+221 75 456 78 90",
    password: "demo1234",
    dateOfBirth: new Date("1995-01-30"),
    gender: "M",
    address: {
      street: "321 Rue Kermel",
      city: "Dakar",
      postalCode: "12500",
      country: "Sénégal"
    },
    bloodType: "AB+",
    medicalHistory: [],
    allergies: ["Iode"],
    emergencyContact: {
      name: "Fatima Ndiaye",
      phone: "+221 75 098 76 54",
      relationship: "Mère"
    }
  },
  {
    firstName: "Aminata",
    lastName: "Diouf",
    email: "aminata.diouf@email.com",
    phone: "+221 70 567 89 01",
    password: "demo1234",
    dateOfBirth: new Date("1982-09-12"),
    gender: "F",
    address: {
      street: "654 Avenue Cheikh Anta Diop",
      city: "Dakar",
      postalCode: "12500",
      country: "Sénégal"
    },
    bloodType: "O-",
    medicalHistory: ["Migraines chroniques"],
    allergies: ["Lactose"],
    emergencyContact: {
      name: "Moussa Diouf",
      phone: "+221 70 654 32 10",
      relationship: "Frère"
    }
  }
];

const bedsInitiaux = [
  {
    bedNumber: "UCI-001",
    roomNumber: "UCI-01",
    department: "UCI",
    capacity: 1,
    isOccupied: false,
    status: "available"
  },
  {
    bedNumber: "UCI-002",
    roomNumber: "UCI-01",
    department: "UCI",
    capacity: 1,
    isOccupied: true,
    status: "occupied"
  },
  {
    bedNumber: "INT-101",
    roomNumber: "INT-10",
    department: "Interne",
    capacity: 1,
    isOccupied: false,
    status: "available"
  },
  {
    bedNumber: "INT-102",
    roomNumber: "INT-10",
    department: "Interne",
    capacity: 1,
    isOccupied: true,
    status: "occupied"
  },
  {
    bedNumber: "INT-201",
    roomNumber: "INT-20",
    department: "Interne",
    capacity: 1,
    isOccupied: false,
    status: "available"
  },
  {
    bedNumber: "URG-001",
    roomNumber: "URG-01",
    department: "Urgence",
    capacity: 1,
    isOccupied: false,
    status: "available"
  },
  {
    bedNumber: "URG-002",
    roomNumber: "URG-01",
    department: "Urgence",
    capacity: 1,
    isOccupied: false,
    status: "available"
  },
  {
    bedNumber: "PED-101",
    roomNumber: "PED-10",
    department: "Pédiatrie",
    capacity: 1,
    isOccupied: true,
    status: "occupied"
  },
  {
    bedNumber: "MAT-101",
    roomNumber: "MAT-10",
    department: "Maternité",
    capacity: 1,
    isOccupied: false,
    status: "available"
  },
  {
    bedNumber: "CHI-101",
    roomNumber: "CHI-10",
    department: "Chirurgie",
    capacity: 1,
    isOccupied: false,
    status: "available"
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthlink-clinic', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connecté pour l\'initialisation complète');
  } catch (error) {
    console.error(`Erreur de connexion: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Début de l\'initialisation de la base de données...\n');

    // Vérifier et nettoyer les données existantes
    console.log('🧹 Nettoyage des données existantes...');
    await Promise.all([
      Patient.deleteMany({}),
      Bed.deleteMany({}),
      Appointment.deleteMany({}),
      Payment.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('✓ Données existantes supprimées\n');

    // 1. Patients
    console.log('👥 Création des patients...');
    const patients = [];
    for (const patientData of patientsInitiaux) {
      const patient = new Patient(patientData);
      await patient.save();
      patients.push(patient);
    }
    console.log(`✓ ${patients.length} patients créés`);

    // 2. Beds
    console.log('🛏️  Création des lits...');
    const beds = await Bed.insertMany(bedsInitiaux);
    console.log(`✓ ${beds.length} lits créés`);

    // 3. Appointments (rendez-vous)
    console.log('📅 Création des rendez-vous...');
    const appointmentsData = [
      {
        patientId: patients[0]._id,
        appointmentDate: new Date('2026-05-15'),
        appointmentTime: '09:00',
        department: 'Interne',
        doctorName: 'Dr. Faye',
        reason: 'Consultation de suivi pour hypertension',
        status: 'confirmed',
        bedId: beds[2]._id,
        isPaid: true,
        paymentMethod: 'wave'
      },
      {
        patientId: patients[1]._id,
        appointmentDate: new Date('2026-05-16'),
        appointmentTime: '14:30',
        department: 'Urgence',
        doctorName: 'Dr. Diop',
        reason: 'Crise d\'asthme',
        status: 'completed',
        bedId: beds[5]._id,
        isPaid: true,
        paymentMethod: 'orange_money'
      },
      {
        patientId: patients[2]._id,
        appointmentDate: new Date('2026-05-17'),
        appointmentTime: '11:00',
        department: 'Pédiatrie',
        doctorName: 'Dr. Ndiaye',
        reason: 'Consultation pédiatrique',
        status: 'scheduled',
        bedId: beds[7]._id,
        isPaid: false
      },
      {
        patientId: patients[3]._id,
        appointmentDate: new Date('2026-05-18'),
        appointmentTime: '16:00',
        department: 'Chirurgie',
        doctorName: 'Dr. Sow',
        reason: 'Consultation pré-opératoire',
        status: 'confirmed',
        bedId: beds[9]._id,
        isPaid: true,
        paymentMethod: 'cash'
      },
      {
        patientId: patients[4]._id,
        appointmentDate: new Date('2026-05-19'),
        appointmentTime: '10:30',
        department: 'Maternité',
        doctorName: 'Dr. Ba',
        reason: 'Suivi de grossesse',
        status: 'scheduled',
        bedId: beds[8]._id,
        isPaid: false
      }
    ];

    const appointments = await Appointment.insertMany(appointmentsData);
    console.log(`✓ ${appointments.length} rendez-vous créés`);

    // 4. Payments (paiements)
    console.log('💰 Création des paiements...');
    const paymentsData = [
      {
        patientId: patients[0]._id,
        appointmentId: appointments[0]._id,
        amount: 25000,
        paymentMethod: 'wave',
        transactionId: 'WAVE_TXN_001',
        status: 'completed',
        paymentDate: new Date('2026-05-15'),
        description: 'Consultation Interne - Dr. Faye',
        phoneNumber: '+221 77 123 45 67'
      },
      {
        patientId: patients[1]._id,
        appointmentId: appointments[1]._id,
        amount: 35000,
        paymentMethod: 'orange_money',
        transactionId: 'OM_TXN_001',
        status: 'completed',
        paymentDate: new Date('2026-05-16'),
        description: 'Urgence - Crise d\'asthme',
        phoneNumber: '+221 76 234 56 78'
      },
      {
        patientId: patients[3]._id,
        appointmentId: appointments[3]._id,
        amount: 50000,
        paymentMethod: 'cash',
        status: 'completed',
        paymentDate: new Date('2026-05-18'),
        description: 'Consultation Chirurgie - Dr. Sow'
      }
    ];

    const payments = await Payment.insertMany(paymentsData);
    console.log(`✓ ${payments.length} paiements créés`);

    // 5. Notifications
    console.log('🔔 Création des notifications...');
    const notificationsData = [
      {
        patientId: patients[0]._id,
        type: 'appointment_reminder',
        title: 'Rappel de rendez-vous',
        message: 'Votre rendez-vous avec Dr. Faye est demain à 09:00',
        relatedId: appointments[0]._id,
        channel: 'sms'
      },
      {
        patientId: patients[0]._id,
        type: 'payment_successful',
        title: 'Paiement confirmé',
        message: 'Votre paiement de 25 000 XOF a été traité avec succès',
        relatedId: payments[0]._id,
        channel: 'email'
      },
      {
        patientId: patients[1]._id,
        type: 'appointment_confirmed',
        title: 'Rendez-vous confirmé',
        message: 'Votre rendez-vous aux urgences a été confirmé',
        relatedId: appointments[1]._id,
        channel: 'in-app'
      },
      {
        patientId: patients[2]._id,
        type: 'appointment_reminder',
        title: 'Rappel de rendez-vous',
        message: 'N\'oubliez pas votre rendez-vous en pédiatrie demain',
        relatedId: appointments[2]._id,
        channel: 'whatsapp'
      },
      {
        patientId: patients[3]._id,
        type: 'bed_assigned',
        title: 'Lit assigné',
        message: 'Un lit vous a été assigné en chirurgie',
        relatedId: beds[9]._id,
        channel: 'in-app'
      },
      {
        patientId: patients[4]._id,
        type: 'payment_reminder',
        title: 'Rappel de paiement',
        message: 'Veuillez régler les frais de votre consultation',
        relatedId: appointments[4]._id,
        channel: 'sms'
      }
    ];

    const notifications = await Notification.insertMany(notificationsData);
    console.log(`✓ ${notifications.length} notifications créées`);

    console.log('\n🎉 Initialisation complète terminée avec succès !');
    console.log('\n📊 Résumé des données créées :');
    console.log(`   👥 Patients: ${patients.length}`);
    console.log(`   🛏️  Lits: ${beds.length}`);
    console.log(`   📅 Rendez-vous: ${appointments.length}`);
    console.log(`   💰 Paiements: ${payments.length}`);
    console.log(`   🔔 Notifications: ${notifications.length}`);

  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
};

const initDatabase = async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  console.log('\n👋 Connexion fermée. Base de données prête !');
};

initDatabase();
