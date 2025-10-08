# Guide de Démarrage - Agent Dashboard

## 🔧 Corrections effectuées

### Problèmes résolus :
1. ✅ **`usersApi.js` était vide** - Maintenant contient toutes les fonctions API
2. ✅ **Dashboard utilisait des données simulées** - Maintenant connecté à MongoDB
3. ✅ **Formulaire d'ajout d'utilisateur manquant** - Ajouté avec modal complet
4. ✅ **Compteurs non mis à jour** - Maintenant calculés depuis la vraie base de données

---

## 📋 Prérequis

1. **MongoDB** doit être installé et démarré sur `localhost:27017`
2. **Node.js** installé (v14 ou supérieur)

---

## 🚀 Démarrage

### 1️⃣ Démarrer MongoDB

```powershell
# Vérifier si MongoDB est en cours d'exécution
Get-Process mongod

# Si MongoDB n'est pas démarré, lancez-le :
# (Ajustez le chemin selon votre installation)
mongod --dbpath "C:\data\db"
```

### 2️⃣ Démarrer le Backend

```powershell
# Aller dans le dossier backend
cd c:\table\backend

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer le serveur
node server.js
```

**Résultat attendu :**
```
Connecté à MongoDB
Serveur démarré sur le port 5000
```

### 3️⃣ Démarrer le Frontend

```powershell
# Ouvrir un NOUVEAU terminal
# Aller dans le dossier frontend
cd c:\table\agent-dashboard-frontend

# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer l'application
npm run dev
```

**Résultat attendu :**
```
VITE v... ready in ... ms
➜  Local:   http://localhost:5173/
```

---

## 🧪 Tester l'application

### 1. Connexion
- Ouvrez `http://localhost:5173`
- Connectez-vous avec un compte agent existant
- Si aucun compte n'existe, créez-en un via l'endpoint `/api/auth/register`

### 2. Vérifier le Dashboard
- Les compteurs (Clients, Agents, Distributeurs) doivent afficher **0** si la base est vide
- Ils se mettront à jour automatiquement quand vous ajouterez des utilisateurs

### 3. Ajouter un utilisateur
1. Allez dans la section **"Gestion des Utilisateurs"**
2. Cliquez sur **"Ajouter Utilisateur"**
3. Remplissez le formulaire :
   - Nom : `Diop`
   - Prénom : `Amadou`
   - Email : `amadou@example.com`
   - Mot de passe : `test123`
   - Numéro de compte : `CLI001`
   - Téléphone : `+221771234567`
   - Rôle : `Client`
4. Cliquez sur **"Ajouter l'utilisateur"**

### 4. Vérifier la mise à jour
- ✅ L'utilisateur apparaît dans la liste
- ✅ Le compteur "Nombre de Clients" passe à **1**
- ✅ Vous pouvez rechercher l'utilisateur
- ✅ Vous pouvez bloquer/débloquer l'utilisateur
- ✅ Vous pouvez supprimer l'utilisateur

---

## 🔍 Résolution des problèmes

### ❌ Erreur : "Jeton d'authentification manquant"
**Cause :** Vous n'êtes pas connecté  
**Solution :** Connectez-vous d'abord via la page de login

### ❌ Erreur : "Erreur de connexion à MongoDB"
**Cause :** MongoDB n'est pas démarré  
**Solution :** Lancez MongoDB avec `mongod --dbpath "C:\data\db"`

### ❌ Erreur : "CORS policy"
**Cause :** Le backend n'accepte pas les requêtes du frontend  
**Solution :** Vérifiez que `cors()` est activé dans `backend/server.js` (ligne 15)

### ❌ Les compteurs restent à 0
**Cause :** Aucun utilisateur dans la base OU erreur d'authentification  
**Solution :** 
1. Vérifiez la console du navigateur (F12) pour voir les erreurs
2. Ajoutez un utilisateur via le formulaire
3. Rechargez la page

### ❌ Le bouton "Ajouter Utilisateur" ne fonctionne pas
**Cause :** Erreur JavaScript  
**Solution :** 
1. Ouvrez la console (F12)
2. Vérifiez les erreurs
3. Assurez-vous que tous les composants UI sont installés

---

## 📊 Structure de la base de données

### Collection : `users`
```json
{
  "_id": "ObjectId",
  "nom": "Diop",
  "prenom": "Amadou",
  "email": "amadou@example.com",
  "password": "$2a$10$...", // hashé avec bcrypt
  "numeroCompte": "CLI001",
  "telephone": "+221771234567",
  "role": "client", // ou "agent" ou "distributeur"
  "photo": "https://...",
  "isActive": true,
  "createdAt": "2025-10-03T...",
  "updatedAt": "2025-10-03T..."
}
```

---

## 🔗 Endpoints API disponibles

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Utilisateurs
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/:id` - Récupère un utilisateur
- `POST /api/users` - Ajoute un utilisateur
- `PUT /api/users/:id` - Met à jour un utilisateur
- `DELETE /api/users/:id` - Supprime un utilisateur
- `PUT /api/users/toggle-status/:id` - Bloque/Débloque
- `GET /api/users/search?query=...` - Recherche

### Transactions
- `POST /api/transactions/deposit` - Effectue un dépôt
- `GET /api/transactions/history` - Historique
- `PUT /api/transactions/cancel/:id` - Annule
- `PUT /api/transactions/block/:id` - Bloque

---

## ✅ Checklist de vérification

- [ ] MongoDB est démarré
- [ ] Backend affiche "Connecté à MongoDB"
- [ ] Frontend est accessible sur http://localhost:5173
- [ ] Vous pouvez vous connecter
- [ ] Le Dashboard affiche les compteurs
- [ ] Vous pouvez ajouter un utilisateur
- [ ] Le compteur se met à jour après ajout
- [ ] Vous pouvez rechercher un utilisateur
- [ ] Vous pouvez bloquer/débloquer un utilisateur
- [ ] Vous pouvez supprimer un utilisateur

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs du backend (terminal)
3. Vérifiez que MongoDB est bien démarré
4. Vérifiez que le port 5000 n'est pas déjà utilisé
