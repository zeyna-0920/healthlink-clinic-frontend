import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Notification from './models/Notification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkRecentNotifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log(`\n--- 10 dernières notifications ---`);
    if (notifications.length === 0) {
      console.log('Aucune notification trouvée.');
    } else {
      notifications.forEach((n, i) => {
        console.log(`\n[${i+1}] Type: ${n.type}`);
        console.log(`Titre: ${n.title}`);
        console.log(`Message: ${n.message}`);
        console.log(`Créé le: ${n.createdAt}`);
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
  }
}

checkRecentNotifications();
