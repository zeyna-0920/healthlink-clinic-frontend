# Structure du Projet - Clinique Moulaye Dabakh

## 📂 Organisation

```
healthlink-clinic/
├── backend/           # API Express + MongoDB (code + README)
├── frontend/          # Application React (Vite + TanStack Router)
├── package.json       # Scripts racine (dev:all, install:all, …)
└── start-all.sh       # Bash : lance frontend + backend
```

## 🚀 Démarrage Rapide

### Depuis la racine (recommandé)
```bash
npm run install:all
npm run dev:all
# Frontend ~ http://localhost:3000 · API http://localhost:5000
```

### Backend seul:
```bash
cd backend
npm install
npm run dev
# Serveur sur http://localhost:5000
```

### Frontend seul:
```bash
cd frontend
npm install
npm run dev
# Application sur http://localhost:3000
```

### Les deux (Bash / Git Bash):
```bash
./start-all.sh
```

## 📋 Fonctionnalités

### Frontend:
- Interface patient moderne
- Gestion des rendez-vous
- Guide des médicaments
- Espace administration
- Design responsive

### Backend:
- API REST complète
- Base de données MongoDB
- Authentification JWT
- Gestion patients, rendez-vous, paiements

## 🛠️ Technologies

- **Frontend**: React, TypeScript, TanStack Router, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Build**: Vite, ESLint, Prettier