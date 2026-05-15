# Guide MongoDB pour les Médicaments

## Configuration complète

L'intégration MongoDB pour les médicaments a été mise en place avec succès. Voici comment l'utiliser:

## 🔧 Installation et Démarrage

### 1. Vérifier votre URI MongoDB
Le fichier `backend/.env` contient déjà votre URI MongoDB:
```
MONGODB_URI=mongodb+srv://dienebat782_db_user:KGRXyIxZYVm4pEZd@cluster0.lm5jbi4.mongodb.net/healthlink-clinic?retryWrites=true&w=majority
```

### 2. Initialiser la base de données complète
Exécutez ce script pour peupler la base de données avec toutes les données de test:

```bash
cd backend
npm run seed:all
```

Cela va créer :
- **12 médicaments** (fièvre, douleur, infection, cœur, diarrhée)
- **5 patients** avec profils complets
- **10 lits** dans différents départements
- **5 rendez-vous** avec différents statuts
- **3 paiements** (Wave, Orange Money, Cash)
- **6 notifications** de différents types

### 3. Démarrer le serveur
```bash
npm run dev    # Mode développement avec rechargement automatique
npm start      # Mode production
```

### 4. Démarrer le frontend
Dans le dossier racine du projet:
```bash
npm run dev
```

## 📡 Points de terminaison API

### Médicaments
```
GET /api/medicaments              # Tous les médicaments (12)
GET /api/medicaments/categorie/:cat # Par catégorie
POST /api/medicaments             # Créer un médicament
PUT /api/medicaments/:id          # Modifier
DELETE /api/medicaments/:id       # Supprimer
```

### Patients
```
GET /api/patients                 # Tous les patients (5)
GET /api/patients/:id             # Détails patient
POST /api/patients                # Créer patient
PUT /api/patients/:id             # Modifier
DELETE /api/patients/:id          # Supprimer
```

### Rendez-vous
```
GET /api/appointments            # Tous les RDV (5)
GET /api/appointments/:id        # Détails RDV
POST /api/appointments           # Créer RDV
PUT /api/appointments/:id        # Modifier
DELETE /api/appointments/:id     # Supprimer
```

### Lits
```
GET /api/beds                   # Tous les lits (10)
GET /api/beds/:id               # Détails lit
POST /api/beds                  # Créer lit
PUT /api/beds/:id               # Modifier
DELETE /api/beds/:id            # Supprimer
```

### Paiements
```
GET /api/payments               # Tous les paiements (3)
GET /api/payments/:id           # Détails paiement
POST /api/payments              # Créer paiement
PUT /api/payments/:id           # Modifier
DELETE /api/payments/:id        # Supprimer
```

### Notifications
```
GET /api/notifications          # Toutes les notifications (6)
GET /api/notifications/patient/:patientId  # Notifications d'un patient
POST /api/notifications/create  # Créer notification
PUT /api/notifications/:id/read # Marquer comme lue
```

## 🌐 Configuration Frontend

Le fichier `.env.local` à la racine du projet contient:
```
VITE_API_URL=http://localhost:5000
```

Cette variable est utilisée par `src/routes/api/-medicaments.ts` pour récupérer les données depuis MongoDB.

## 🔄 Flux de données

```
Frontend (medicaments.tsx)
    ↓
src/routes/api/-medicaments.ts
    ↓
Fetch vers http://localhost:5000/api/medicaments
    ↓
Backend (server.js)
    ↓
Routes (medicamentRoutes.js)
    ↓
Contrôleur (medicamentController.js)
    ↓
Modèle Mongoose (Medicament.js)
    ↓
MongoDB (cluster0.lm5jbi4.mongodb.net)
```

## 💾 Données de test créées

### 👥 Patients (5)
- Fatou Diallo - Dakar, Hypertension
- Amadou Sow - Dakar, Asthme
- Mariama Ba - Saint-Louis, Arthrite
- Ibrahima Ndiaye - Dakar, Consultation générale
- Aminata Diouf - Dakar, Migraines

### 🛏️ Lits (10)
- UCI: 2 lits (1 occupé)
- Interne: 3 lits (1 occupé)
- Urgence: 2 lits (libres)
- Pédiatrie: 1 lit (occupé)
- Maternité: 1 lit (libre)
- Chirurgie: 1 lit (libre)

### 📅 Rendez-vous (5)
- Consultation Interne (payé - Wave)
- Urgence Asthme (payé - Orange Money)
- Pédiatrie (non payé)
- Chirurgie (payé - Cash)
- Maternité (non payé)

### 💰 Paiements (3)
- 25 000 XOF - Wave
- 35 000 XOF - Orange Money
- 50 000 XOF - Cash

### 🔔 Notifications (6)
- Rappels de rendez-vous
- Confirmations de paiement
- Assignations de lit
- Rappels de paiement

## ✅ Vérification

Pour vérifier que tout fonctionne correctement:

1. **Terminal 1** - Démarrer le serveur:
   ```bash
   cd backend
   npm run dev
   ```
   Vous devriez voir: `MongoDB Connected`

2. **Terminal 2** - Initialiser la base de données (si nécessaire):
   ```bash
   cd backend
   npm run seed:all
   ```

3. **Terminal 3** - Démarrer le frontend:
   ```bash
   npm run dev
   ```

4. **Navigation** - Accédez aux pages et APIs:
   - http://localhost:8080/medicaments
   - http://localhost:5000/api/patients
   - http://localhost:5000/api/appointments
   - http://localhost:5000/api/beds
   - http://localhost:5000/api/payments
   - http://localhost:5000/api/notifications

## 🎯 Scripts disponibles

```bash
# Médicaments seulement
npm run seed

# Base de données complète
npm run seed:all
```

## 💡 Remarques importantes

- Le frontend utilise les données MongoDB quand l'API est disponible
- Si l'API n'est pas accessible, les données locales s'affichent automatiquement
- Assurez-vous que MongoDB Atlas est actif et accessible
- Vérifiez que votre IP est autorisée dans les paramètres de sécurité MongoDB Atlas

## 🐛 Dépannage

Si vous rencontrez des problèmes:

1. **Vérifier la connexion MongoDB**:
   ```bash
   cd backend
   npm run dev
   ```
   Cherchez le message: `MongoDB Connected`

2. **Vérifier les routes**:
   Accédez à http://localhost:5000/api/health

3. **Vérifier les données**:
   ```bash
   curl http://localhost:5000/api/medicaments
   curl http://localhost:5000/api/patients
   ```

4. **Consulter les logs**:
   Vérifiez la console pour les messages d'erreur
