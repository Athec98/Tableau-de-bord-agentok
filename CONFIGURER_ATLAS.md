# ☁️ Configuration MongoDB Atlas - Guide Complet

## ✅ Étapes de Configuration

### 1️⃣ Créer un Compte et un Cluster

1. **Aller sur** : https://www.mongodb.com/cloud/atlas/register
2. **Créer un compte** (email ou Google)
3. **Créer un cluster gratuit** (M0 - 512 MB)
   - Provider : AWS/Azure/Google Cloud
   - Région : **Paris (eu-west-3)** ou proche de vous
   - Cliquer **"Create Cluster"** (attend 1-3 min)

---

### 2️⃣ Créer un Utilisateur Database

Dans la popup "Security Quickstart" :
- **Username** : `admin`
- **Password** : `admin123` (ou générer un)
- ⚠️ **NOTER LE MOT DE PASSE** !
- Cliquer **"Create User"**

---

### 3️⃣ Autoriser l'Accès Réseau

1. Cliquer **"Network Access"** (menu gauche)
2. Cliquer **"Add IP Address"**
3. **Choisir** : "Allow Access from Anywhere"
4. IP : `0.0.0.0/0` (accepte toutes les IPs)
5. Cliquer **"Confirm"**

---

### 4️⃣ Obtenir la Connection String

1. Cliquer **"Database"** (menu gauche)
2. Sur votre cluster, cliquer **"Connect"**
3. Choisir **"Connect your application"**
4. Driver : **Node.js**, Version : **4.1 or later**
5. **COPIER** la connection string :

```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Exemple réel** :
```
mongodb+srv://admin:admin123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

---

### 5️⃣ Modifier le Fichier `.env`

**Ouvrir** : `c:\Tableau-de-bord-agent\backend\.env`

**Remplacer cette ligne** :
```env
MONGO_URI=mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/agent-dashboard?retryWrites=true&w=majority
```

**Par votre connection string** (exemple) :
```env
MONGO_URI=mongodb+srv://admin:admin123@cluster0.abc123.mongodb.net/agent-dashboard?retryWrites=true&w=majority
```

⚠️ **IMPORTANT** :
- Remplacez `<password>` par votre **vrai mot de passe**
- Remplacez `xxxxx` par votre **vrai cluster ID**
- Gardez `/agent-dashboard?retryWrites=true&w=majority` à la fin

---

### 6️⃣ Exemple Complet de `.env`

```env
# Configuration de la base de données MongoDB

# ☁️ MongoDB Atlas (Cloud)
# ⬇️ COLLEZ VOTRE CONNECTION STRING ICI ⬇️
MONGO_URI=mongodb+srv://admin:admin123@cluster0.abc123.mongodb.net/agent-dashboard?retryWrites=true&w=majority

# Configuration du serveur
PORT=5000
NODE_ENV=development

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Configuration CORS
CORS_ORIGIN=http://localhost:5173
```

---

### 7️⃣ Redémarrer le Backend

```powershell
# Dans le terminal backend
cd c:\Tableau-de-bord-agent\backend
npm start
```

**✅ Vous devriez voir** :
```
Serveur démarré sur le port 5000
Connecté à MongoDB ✓
```

---

## 🧪 Test de Connexion

Si tout fonctionne, vous verrez :
```
[dotenv@17.2.3] injecting env (6) from .env
Serveur démarré sur le port 5000
Connecté à MongoDB
```

❌ **Si erreur** :
- Vérifiez le mot de passe (pas d'espaces, caractères spéciaux encodés)
- Vérifiez l'accès réseau (0.0.0.0/0 autorisé)
- Vérifiez que le cluster est bien démarré

---

## 🎯 Résumé des Modifications

### Fichier : `backend/.env`

**AVANT** :
```env
MONGO_URI=mongodb://localhost:27017/agent-dashboard
```

**APRÈS** :
```env
MONGO_URI=mongodb+srv://admin:VotreMotDePasse@cluster0.abc123.mongodb.net/agent-dashboard?retryWrites=true&w=majority
```

---

## 🔒 Encodage du Mot de Passe

Si votre mot de passe contient des caractères spéciaux (`@`, `#`, `$`, etc.), encodez-le :

**Exemple** :
- Mot de passe : `admin@123`
- Encodé : `admin%40123` (@ → %40)

**Outil en ligne** : https://www.urlencoder.org/

---

## 🚀 Démarrer l'Application Complète

Une fois MongoDB Atlas connecté :

### Terminal 1 - Backend
```powershell
cd c:\Tableau-de-bord-agent\backend
npm start
```

### Terminal 2 - Frontend
```powershell
cd c:\Tableau-de-bord-agent\agent-dashboard-frontend
npm run dev
```

### Ouvrir le Navigateur
**URL** : http://localhost:5173

**Login** :
- Email : `agent@example.com`
- Mot de passe : `test123`

---

## 📊 Gérer les Données dans Atlas

1. **Atlas Dashboard** : https://cloud.mongodb.com/
2. Cliquer **"Database"**
3. Cliquer **"Browse Collections"** sur votre cluster
4. Voir les collections : `users`, `transactions`

---

## 🎉 Félicitations !

Votre application utilise maintenant MongoDB Atlas :
- ✅ Base de données cloud gratuite
- ✅ Accessible de partout
- ✅ Backups automatiques
- ✅ Aucune maintenance locale

**Profitez de votre application !** 🚀
