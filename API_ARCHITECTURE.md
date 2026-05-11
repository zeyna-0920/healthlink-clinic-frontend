# Architecture HealthLink Clinic API

## Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend React/TanStack                       │
│  (Interface utilisateur - Patients, Médecins, Administrateurs)  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/REST
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   Express Server (Port 5000)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           ROUTES & CONTROLLERS                           │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  • Patients      (/api/patients)                        │   │
│  │  • Beds          (/api/beds)                            │   │
│  │  • Appointments  (/api/appointments)                    │   │
│  │  • Payments      (/api/payments)                        │   │
│  │  • Notifications (/api/notifications)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         │                                        │
│  ┌──────────────────────▼──────────────────────────────────┐   │
│  │       MIDDLEWARE (Validation, ErrorHandler)             │   │
│  └──────────────────────┬──────────────────────────────────┘   │
│                         │                                        │
│  ┌──────────────────────▼──────────────────────────────────┐   │
│  │   UTILS (Helpers, Notifications, Calculations)         │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    ▼                    ▼                    ▼
┌─────────────┐   ┌─────────────┐   ┌──────────────┐
│  MongoDB    │   │ Wave API    │   │Orange Money  │
│  Database   │   │ (Payments)  │   │API(Payments) │
└─────────────┘   └─────────────┘   └──────────────┘

COLLECTIONS MONGODB:
├── patients
├── beds
├── appointments
├── payments
└── notifications
```

## Flux de Données - Inscription + Rendez-vous + Paiement

```
1. INSCRIPTION PATIENT
   ┌─────────────────────────────┐
   │ Patient remplit le formulaire│
   └──────────┬──────────────────┘
              │
   ┌──────────▼──────────────────┐
   │ POST /api/patients/register  │
   └──────────┬──────────────────┘
              │
   ┌──────────▼──────────────────────────┐
   │ Validation (email unique, données)   │
   └──────────┬──────────────────────────┘
              │
   ┌──────────▼──────────────────────────┐
   │ Créer patient en DB                  │
   │ Envoyer notification "Bienvenue"    │
   └──────────┬──────────────────────────┘
              │
   ┌──────────▼──────────────────────────┐
   │ Patient inscrit & récoit ID          │
   └──────────────────────────────────────┘

2. PRISE DE RENDEZ-VOUS
   ┌──────────────────────────────────────┐
   │ Patient sélectionne date/heure        │
   └──────────┬───────────────────────────┘
              │
   ┌──────────▼──────────────────────────┐
   │ POST /api/appointments/create         │
   └──────────┬──────────────────────────┘
              │
   ┌──────────▼──────────────────────────────────┐
   │ Vérifier disponibilité des lits             │
   │ Créer rendez-vous                           │
   │ Assigner lit si disponible                  │
   │ Envoyer notification confirmation           │
   └──────────┬──────────────────────────────────┘
              │
   ┌──────────▼──────────────────────────────────┐
   │ Rendez-vous confirmé                        │
   └──────────────────────────────────────────────┘

3. PAIEMENT
   ┌──────────────────────────────────────┐
   │ Patient sélectionne méthode paiement  │
   │ (Wave ou Orange Money)               │
   └──────────┬───────────────────────────┘
              │
   ┌──────────▼──────────────────────────┐
   │ POST /api/payments/create             │
   └──────────┬──────────────────────────┘
              │
   ┌──────────▼──────────────────────────────────────┐
   │ POST /api/payments/wave/initiate (ou OM)        │
   │ Envoyer demande de paiement au téléphone        │
   └──────────┬──────────────────────────────────────┘
              │
   ┌──────────▼──────────────────────────────────────┐
   │ Patient confirme paiement sur son téléphone     │
   └──────────┬──────────────────────────────────────┘
              │
   ┌──────────▼──────────────────────────────────────┐
   │ POST /api/payments/confirm                      │
   │ Mettre à jour statut rendez-vous (isPaid=true) │
   │ Envoyer notification "Paiement réussi"         │
   └──────────┬──────────────────────────────────────┘
              │
   ┌──────────▼──────────────────────────────────────┐
   │ Paiement confirmé - Patient prêt pour RDV       │
   └──────────────────────────────────────────────────┘
```

## Endpoints Principaux

### Patients
```
POST   /api/patients/register              → Inscrire un patient
GET    /api/patients                       → Lister tous les patients
GET    /api/patients/:patientId            → Obtenir un patient
PUT    /api/patients/:patientId            → Mettre à jour
DELETE /api/patients/:patientId            → Archiver
```

### Lits
```
POST   /api/beds/create                    → Créer un lit
GET    /api/beds                           → Tous les lits
GET    /api/beds/available                 → Lits disponibles
GET    /api/beds/statistics                → Stats d'occupation
POST   /api/beds/assign                    → Assigner patient
POST   /api/beds/:bedId/release            → Libérer lit
```

### Rendez-vous
```
POST   /api/appointments/create            → Créer RDV
GET    /api/appointments                   → Tous les RDV
GET    /api/appointments/patient/:id       → RDV du patient
POST   /api/appointments/:id/confirm       → Confirmer
POST   /api/appointments/:id/complete      → Terminer
```

### Paiements
```
POST   /api/payments/create                → Créer paiement
POST   /api/payments/wave/initiate         → Initier Wave
POST   /api/payments/orange-money/initiate → Initier Orange Money
POST   /api/payments/confirm               → Confirmer
GET    /api/payments/statistics            → Statistiques
```

### Notifications
```
GET    /api/notifications/patient/:id      → Notifications du patient
GET    /api/notifications/patient/:id/unread → Non lues
POST   /api/notifications/:id/read         → Marquer comme lue
```

## Statuts et États

### Patient
- `active` - Patient actif
- `inactive` - Inactif
- `archived` - Archivé

### Bed
- `available` - Disponible
- `occupied` - Occupé
- `maintenance` - En maintenance
- `reserved` - Réservé

### Appointment
- `scheduled` - Planifié
- `confirmed` - Confirmé
- `completed` - Complété
- `cancelled` - Annulé
- `no-show` - Absent

### Payment
- `pending` - En attente
- `completed` - Complété
- `failed` - Échoué
- `refunded` - Remboursé

### Notification
- `appointment_reminder` - Rappel RDV
- `appointment_confirmed` - RDV confirmé
- `payment_reminder` - Rappel paiement
- `payment_successful` - Paiement réussi
- `payment_failed` - Paiement échoué
- `registration_complete` - Inscription complète
- `bed_assigned` - Lit assigné
- `bed_released` - Lit libéré
