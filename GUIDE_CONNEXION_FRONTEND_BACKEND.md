# Guide de Connexion Frontend-Backend

## 📁 Structure du Projet

Votre projet est divisé en deux parties :
- **Backend** : `C:\backend` (serveur API Express + MongoDB)
- **Frontend** : `C:\Tableau-de-bord-agent\agent-dashboard-frontend` (application React + Vite)

## ✅ Corrections Apportées

### 1. Configuration API Frontend
- ✅ Créé `src/services/api.js` avec axios configuré
- ✅ Configuration de l'URL de base : `http://localhost:5000/api`
- ✅ Intercepteurs JWT pour l'authentification automatique
- ✅ Gestion des erreurs 401 (déconnexion automatique)

### 2. Composants Mis à Jour
- ✅ **Login.jsx** : Connexion réelle à l'API `/api/auth/login`
- ✅ **Users.jsx** : Chargement, suppression, blocage via API
- ✅ **Deposit.jsx** : Création de dépôts via API `/api/transactions/deposit`
- ✅ **main.jsx** : Ajout du Toaster (sonner) pour les notifications

### 3. Configuration Vite
- ✅ Proxy configuré pour rediriger `/api` vers `http://localhost:5000`
- ✅ Fichier `.env.local` créé avec `VITE_API_URL`

## 🚀 Comment Démarrer

### Étape 1 : Démarrer le Backend

```powershell
# Ouvrir un terminal PowerShell
cd C:\backend

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer le serveur backend
node server.js
```

**Vous devriez voir :**
```
Serveur démarré sur le port 5000
Connecté à MongoDB
```

### Étape 2 : Démarrer le Frontend

```powershell
# Ouvrir un NOUVEAU terminal PowerShell
cd C:\Tableau-de-bord-agent\agent-dashboard-frontend

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer le serveur de développement
npm run dev
```

**Vous devriez voir :**
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Étape 3 : Accéder à l'Application

Ouvrez votre navigateur à : **http://localhost:5173**

## 🔐 Test de Connexion

### Créer un Utilisateur Test

Si vous n'avez pas encore d'utilisateur, créez-en un :

```powershell
cd C:\backend
node createAgent.js
```

Ou utilisez le script de seed :
```powershell
node seed_data.js
```

### Se Connecter

Sur la page de login, utilisez :
- **Email** : L'email de l'utilisateur créé
- **Mot de passe** : Le mot de passe défini lors de la création

## 🔍 Vérification de la Connexion

### 1. Vérifier le Backend
Ouvrez : http://localhost:5000
Vous devriez voir : "API Agent Dashboard"

### 2. Tester l'API directement
```powershell
# Test de connexion (remplacez par vos identifiants)
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"identifier":"agent@example.com","password":"votre_mot_de_passe"}'
```

### 3. Vérifier dans le Navigateur
- Ouvrez les **DevTools** (F12)
- Onglet **Network**
- Essayez de vous connecter
- Vérifiez que les requêtes à `/api/auth/login` réussissent (status 200)

## 🐛 Résolution des Problèmes

### Problème : "Network Error" ou "Failed to fetch"

**Cause** : Le backend n'est pas démarré ou écoute sur un autre port.

**Solution** :
1. Vérifiez que le backend est démarré : `cd C:\backend && node server.js`
2. Vérifiez le port dans `.env` : `PORT=5000`
3. Vérifiez que rien d'autre n'utilise le port 5000

### Problème : "Cannot connect to MongoDB"

**Cause** : Problème de connexion à MongoDB.

**Solution** :
1. Vérifiez votre connexion Internet
2. Vérifiez `MONGO_URI` dans `C:\backend\.env`
3. Essayez de redémarrer le serveur

### Problème : "401 Unauthorized" après connexion

**Cause** : Token JWT invalide ou mal configuré.

**Solution** :
1. Vérifiez `JWT_SECRET` dans `C:\backend\.env`
2. Effacez le localStorage du navigateur (F12 > Application > Local Storage > Clear)
3. Reconnectez-vous

### Problème : CORS Error

**Cause** : Le frontend et le backend ne communiquent pas correctement.

**Solution** :
Le backend a déjà `cors()` activé. Si le problème persiste :
```javascript
// Dans C:\backend\server.js, remplacez app.use(cors()) par :
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## 📋 Checklist de Vérification

Avant de commencer, assurez-vous que :

- [ ] Node.js est installé (`node --version`)
- [ ] Les dépendances backend sont installées (`C:\backend\node_modules` existe)
- [ ] Les dépendances frontend sont installées (`agent-dashboard-frontend\node_modules` existe)
- [ ] Le fichier `.env` existe dans `C:\backend` avec `MONGO_URI`, `PORT`, et `JWT_SECRET`
- [ ] MongoDB Atlas est accessible (connexion Internet OK)
- [ ] Le port 5000 est disponible
- [ ] Le port 5173 est disponible

## 🎯 Fonctionnalités Connectées

### ✅ Déjà Connectées
- **Authentification** : Login avec email/numéro de compte
- **Gestion Utilisateurs** : Liste, recherche, blocage, suppression
- **Dépôts** : Création de dépôts vers distributeurs
- **Notifications** : Toast pour succès/erreurs

### ⏳ À Connecter (prochaines étapes)
- Dashboard (statistiques)
- History (historique des transactions)
- Cancellation (annulation de transactions)

## 📞 Commandes Utiles

### Backend
```powershell
cd C:\backend
node server.js                  # Démarrer le serveur
node createAgent.js             # Créer un agent
node seed_data.js               # Créer des données de test
node check_data.js              # Vérifier les données en DB
```

### Frontend
```powershell
cd C:\Tableau-de-bord-agent\agent-dashboard-frontend
npm run dev                     # Démarrer en mode développement
npm run build                   # Construire pour production
npm run preview                 # Prévisualiser le build
```

## 🎉 Succès !

Si tout fonctionne :
1. Vous voyez la page de login
2. Vous pouvez vous connecter avec vos identifiants
3. Vous voyez le dashboard
4. Les actions (création, modification, suppression) fonctionnent
5. Vous recevez des notifications toast

**La connexion entre votre frontend et backend est maintenant établie ! 🚀**
