# 🚀 Guide de Démarrage - Agent Dashboard

## 📋 Prérequis

1. **Node.js** (version 18 ou supérieure)
2. **MongoDB** (version 5.0 ou supérieure)
3. **npm** ou **pnpm**

## 🔧 Installation

### 1. Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../agent-dashboard-frontend
npm install
```

### 2. Configuration de l'environnement

Les fichiers `.env` ont été créés automatiquement avec les configurations par défaut :

**Backend (.env)**
```
MONGO_URI=mongodb://localhost:27017/agent-dashboard
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Démarrage Rapide

### Option 1: Script automatique (Recommandé)
```powershell
.\start-dev.ps1
```

### Option 2: Démarrage manuel

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd agent-dashboard-frontend
npm run dev
```

## 🌐 Accès aux services

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Backend**: http://localhost:5000

## 🔑 Identifiants de test

- **Email**: agent@example.com
- **Numéro de compte**: AGT001
- **Mot de passe**: (n'importe quoi pour les tests)

## 🛠️ Scripts disponibles

### Backend
- `npm start` - Démarrage en production
- `npm run dev` - Démarrage en développement avec nodemon

### Frontend
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build

## 🐛 Résolution de problèmes

### MongoDB ne démarre pas
```bash
# Créer le répertoire de données
mkdir C:\data\db

# Démarrer MongoDB
mongod --dbpath C:\data\db
```

### Port déjà utilisé
- Backend: Changez le PORT dans `backend/.env`
- Frontend: Vite utilisera automatiquement le port suivant disponible

### Erreurs de CORS
Vérifiez que le frontend pointe vers le bon port du backend dans `agent-dashboard-frontend/.env`

## 📁 Structure du projet

```
Tableau-de-bord-agent/
├── backend/                 # API Node.js/Express
│   ├── controllers/         # Contrôleurs
│   ├── models/             # Modèles Mongoose
│   ├── routes/             # Routes API
│   ├── middleware/         # Middleware
│   └── server.js           # Point d'entrée
├── agent-dashboard-frontend/ # Frontend React/Vite
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── services/       # Services API
│   │   └── hooks/          # Hooks personnalisés
│   └── public/            # Fichiers statiques
└── start-dev.ps1         # Script de démarrage
```

## ✅ Vérifications

1. ✅ Backend configuré avec scripts de démarrage
2. ✅ Frontend configuré avec proxy vers backend
3. ✅ Fichiers .env créés
4. ✅ CORS configuré
5. ✅ Authentification JWT
6. ✅ Interface utilisateur complète

## 🎯 Prochaines étapes

1. Démarrer MongoDB
2. Exécuter `.\start-dev.ps1`
3. Ouvrir http://localhost:5173
4. Se connecter avec les identifiants de test
