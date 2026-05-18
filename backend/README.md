# HealthLink Clinic - Backend API

Structure de base de données MongoDB pour la gestion d'une clinique de santé.

## Installation

1. **Installer les dépendances**
   ```bash
   cd backend
   npm install
   ```

2. **Configurer les variables d'environnement**
   - Copier `.env.example` en `.env`
   - Remplir les valeurs pour MongoDB et les APIs externes (Wave, Orange Money)

3. **Lancer le serveur**
   ```bash
   npm run dev  # Mode développement avec nodemon
   npm start    # Mode production
   ```

## Structure de l'API

### Patients
- `POST /api/patients/register` - Enregistrer un nouveau patient
- `GET /api/patients` - Obtenir tous les patients
- `GET /api/patients/:patientId` - Obtenir un patient
- `PUT /api/patients/:patientId` - Mettre à jour un patient
- `DELETE /api/patients/:patientId` - Archiver un patient
- `GET /api/patients/search?email=` - Rechercher par email

### Lits
- `POST /api/beds/create` - Créer un lit
- `GET /api/beds` - Obtenir tous les lits
- `GET /api/beds/available` - Obtenir les lits disponibles
- `GET /api/beds/statistics` - Statistiques des lits
- `GET /api/beds/department/:department` - Lits par département
- `POST /api/beds/assign` - Assigner un patient à un lit
- `POST /api/beds/:bedId/release` - Libérer un lit
- `POST /api/beds/:bedId/maintenance` - Mettre en maintenance

### Rendez-vous
- `POST /api/appointments/create` - Créer un rendez-vous
- `GET /api/appointments` - Tous les rendez-vous
- `GET /api/appointments/patient/:patientId` - Rendez-vous d'un patient
- `GET /api/appointments/by-date?date=` - Rendez-vous par date
- `PUT /api/appointments/:appointmentId` - Mettre à jour
- `POST /api/appointments/:appointmentId/confirm` - Confirmer
- `POST /api/appointments/:appointmentId/cancel` - Annuler
- `POST /api/appointments/:appointmentId/complete` - Terminer

### Paiements
- `POST /api/payments/create` - Créer un paiement
- `POST /api/payments/wave/initiate` - Initier paiement Wave
- `POST /api/payments/orange-money/initiate` - Initier paiement Orange Money
- `POST /api/payments/confirm` - Confirmer le paiement
- `POST /api/payments/fail` - Marquer comme échoué
- `GET /api/payments` - Tous les paiements
- `GET /api/payments/patient/:patientId` - Paiements d'un patient
- `GET /api/payments/statistics` - Statistiques des paiements

### Notifications
- `POST /api/notifications/create` - Créer une notification
- `GET /api/notifications/patient/:patientId` - Notifications d'un patient
- `GET /api/notifications/patient/:patientId/unread` - Non lues
- `POST /api/notifications/:notificationId/read` - Marquer comme lue
- `POST /api/notifications/patient/:patientId/read-all` - Tout marquer comme lu
- `DELETE /api/notifications/:notificationId` - Supprimer

## Modèles de données

### Patient
```javascript
{
  firstName, lastName, email, phone, dateOfBirth, gender,
  address, bloodType, medicalHistory, allergies, emergencyContact,
  isRegistered, registrationDate, lastConsultation, status
}
```

### Bed
```javascript
{
  bedNumber, roomNumber, department, capacity,
  isOccupied, currentPatient, checkInDate, checkOutDate, status, notes
}
```

### Appointment
```javascript
{
  patientId, appointmentDate, appointmentTime, department,
  doctorName, reason, status, notes, bedId, isPaid, paymentMethod
}
```

### Payment
```javascript
{
  patientId, appointmentId, amount, currency, paymentMethod,
  transactionId, status, paymentDate, description, phoneNumber, reference
}
```

### Notification
```javascript
{
  patientId, type, title, message, relatedId,
  isRead, readAt, channel, sentAt
}
```

## Intégrations à effectuer

1. **Wave API** - Intégration complète du paiement par Wave
2. **Orange Money API** - Intégration complète du paiement Orange Money
3. **Email** - Notifications par email (nodemailer)
4. **SMS** - Notifications par SMS (Twilio ou similaire)
5. **WhatsApp** - Notifications WhatsApp Business API

## Notes de sécurité

- Ajouter l'authentification (JWT)
- Ajouter les autorisations/rôles (admin, doctor, patient)
- Valider toutes les entrées
- Implémenter le rate limiting
- Chiffrer les données sensibles
