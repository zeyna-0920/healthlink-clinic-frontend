# 🏥 HealthLink Clinic - Guide de Démarrage Rapide

## Configuration Initiale

### 1. Préparer l'environnement

```bash
# Créer le fichier .env
cp .env.example .env

# Installer MongoDB localement ou utiliser un service cloud
# Option 1: MongoDB local (installer MongoDB Community Edition)
# Option 2: MongoDB Atlas (cloud) - https://www.mongodb.com/cloud/atlas
```

### 2. Mettre à jour le fichier `.env`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/healthlink-clinic

# Optionnel (pour les intégrations futures)
WAVE_API_KEY=votre_clé_wave
ORANGE_MONEY_API_KEY=votre_clé_orange_money
```

### 3. Démarrer le serveur

```bash
npm run dev  # Mode développement (avec rechargement automatique)
npm start    # Mode production
```

Le serveur s'exécutera sur `http://localhost:5000`

## Fonctionnalités Principales

### 📝 Gestion des Patients
- ✅ Enregistrement des patients
- ✅ Mise à jour des informations
- ✅ Historique médical et allergies
- ✅ Contacts d'urgence

### 🛏️ Gestion des Lits
- ✅ Nombre total de lits disponibles
- ✅ Statut des lits (disponible, occupé, maintenance)
- ✅ Assignation/libération des lits
- ✅ Statistiques d'occupation

### 📅 Gestion des Rendez-vous
- ✅ Prise de rendez-vous
- ✅ Confirmation/annulation
- ✅ Filtrage par date et département
- ✅ Historique des consultations

### 💰 Gestion des Paiements
- ✅ Paiement par Wave
- ✅ Paiement par Orange Money
- ✅ Suivi des transactions
- ✅ Statistiques financières

### 🔔 Notifications
- ✅ Rappels de rendez-vous
- ✅ Notifications de paiement
- ✅ Confirmations d'actions
- ✅ Historique des notifications

## Exemples d'Utilisation

### Créer un Patient

```bash
curl -X POST http://localhost:5000/api/patients/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@example.com",
    "phone": "+221772345678",
    "dateOfBirth": "1990-05-15",
    "gender": "M",
    "bloodType": "O+"
  }'
```

### Obtenir les Lits Disponibles

```bash
curl http://localhost:5000/api/beds/available
```

### Créer un Rendez-vous

```bash
curl -X POST http://localhost:5000/api/appointments/create \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "ID_DU_PATIENT",
    "appointmentDate": "2024-05-20",
    "appointmentTime": "14:00",
    "department": "Interne",
    "reason": "Suivi médical"
  }'
```

### Créer un Paiement Wave

```bash
curl -X POST http://localhost:5000/api/payments/wave/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "ID_DU_PAIEMENT",
    "phoneNumber": "+221772345678",
    "amount": 15000
  }'
```

## Structure des Données

### Patient
```javascript
{
  _id: ObjectId,
  firstName: string,
  lastName: string,
  email: string (unique),
  phone: string,
  dateOfBirth: date,
  gender: enum (M, F, Autre),
  address: {
    street: string,
    city: string,
    postalCode: string,
    country: string
  },
  bloodType: enum (O+, O-, A+, A-, B+, B-, AB+, AB-),
  medicalHistory: [string],
  allergies: [string],
  emergencyContact: {
    name: string,
    phone: string,
    relationship: string
  },
  isRegistered: boolean,
  registrationDate: date,
  lastConsultation: date,
  status: enum (active, inactive, archived)
}
```

### Bed
```javascript
{
  _id: ObjectId,
  bedNumber: string,
  roomNumber: string,
  department: enum (Urgence, Interne, Chirurgie, Maternité, Pédiatrie, UCI),
  capacity: number,
  isOccupied: boolean,
  currentPatient: ObjectId (ref Patient),
  checkInDate: date,
  checkOutDate: date,
  status: enum (available, occupied, maintenance, reserved),
  notes: string
}
```

### Appointment
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref Patient),
  appointmentDate: date,
  appointmentTime: string,
  department: enum,
  doctorName: string,
  reason: string,
  status: enum (scheduled, confirmed, completed, cancelled, no-show),
  notes: string,
  bedId: ObjectId (ref Bed),
  isPaid: boolean,
  paymentMethod: enum (wave, orange_money, cash, credit_card)
}
```

### Payment
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref Patient),
  appointmentId: ObjectId (ref Appointment),
  amount: number,
  currency: string (default: XOF),
  paymentMethod: enum (wave, orange_money, cash, credit_card),
  transactionId: string,
  status: enum (pending, completed, failed, refunded),
  paymentDate: date,
  description: string,
  phoneNumber: string,
  reference: string,
  failureReason: string
}
```

## Améliorations Futures

- [ ] Authentification JWT
- [ ] Rôles et permissions (Admin, Médecin, Patient)
- [ ] Intégration complète Wave API
- [ ] Intégration complète Orange Money API
- [ ] Notifications par email/SMS/WhatsApp
- [ ] Rapports et analytics
- [ ] Export de données
- [ ] Système de chat patient-médecin
- [ ] Historique des consultations
- [ ] Prescriptions électroniques

## Support et Aide

Pour des questions ou des problèmes, consultez :
- Documentation MongoDB: https://docs.mongodb.com
- Documentation Express: https://expressjs.com
- Wave API Docs: https://wave.com/en/developer
- Orange Money API Docs: https://developer.orange.com/

## Licence

ISC
