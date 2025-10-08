# 🚀 DÉPLOIEMENT GRATUIT - Guide Complet

## ✅ Votre application est 100% prête !

Nous allons déployer :
1. **Backend** sur **Render.com** (Gratuit)
2. **Frontend** sur **Vercel** (Gratuit)
3. **Base de données** : MongoDB Atlas (Déjà configuré ✅)

---

## 📋 ÉTAPE 1: Préparer les Fichiers (5 min)

### A. Créer `.gitignore` si pas déjà fait

```bash
cd C:\Tableau-de-bord-agent
```

Créer le fichier `.gitignore` avec :
```
node_modules/
.env
dist/
build/
.DS_Store
*.log
```

### B. Initialiser Git (si pas déjà fait)

```bash
git init
git add .
git commit -m "Application Tableau de Bord Agent - Prête pour déploiement"
```

### C. Créer un compte GitHub

1. Aller sur https://github.com
2. Créer un compte (gratuit)
3. Créer un nouveau repository "Tableau-de-bord-agent"

### D. Pousser le code sur GitHub

```bash
git remote add origin https://github.com/VOTRE-USERNAME/Tableau-de-bord-agent.git
git branch -M main
git push -u origin main
```

---

## 🖥️ ÉTAPE 2: Déployer le BACKEND sur Render.com (10 min)

### 1. Créer un compte Render

1. Aller sur https://render.com
2. Cliquer **"Get Started for Free"**
3. S'inscrire avec GitHub (recommandé)

### 2. Créer un Web Service

1. Dans le dashboard Render, cliquer **"New +"**
2. Choisir **"Web Service"**
3. Connecter votre repository GitHub
4. Sélectionner **"Tableau-de-bord-agent"**

### 3. Configuration du Service

**Paramètres à remplir :**

| Champ | Valeur |
|-------|--------|
| **Name** | `tableau-agent-backend` |
| **Region** | `Frankfurt (EU Central)` (ou le plus proche) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` ⚠️ IMPORTANT |

### 4. Variables d'Environnement

Cliquer sur **"Advanced"** puis ajouter ces variables :

```
MONGO_URI = mongodb+srv://agent_dashboard_db:Assane%401998@cluster1.rmreeqq.mongodb.net/agent-dashboard?retryWrites=true&w=majority&appName=Cluster1

JWT_SECRET = VotreSecretComplexe123456789!@#

JWT_EXPIRE = 7d

PORT = 5000

NODE_ENV = production
```

⚠️ **IMPORTANT** : Changez `JWT_SECRET` par une valeur unique !

### 5. Déployer

1. Cliquer **"Create Web Service"**
2. Attendre 3-5 minutes (le déploiement se fait automatiquement)
3. ✅ Une fois terminé, vous verrez : **"Your service is live"**

### 6. Noter l'URL Backend

Votre backend sera accessible à :
```
https://tableau-agent-backend.onrender.com
```

⚠️ **COPIEZ CETTE URL** - vous en aurez besoin pour le frontend !

---

## 🎨 ÉTAPE 3: Déployer le FRONTEND sur Vercel (5 min)

### 1. Créer un compte Vercel

1. Aller sur https://vercel.com
2. Cliquer **"Sign Up"**
3. S'inscrire avec GitHub (recommandé)

### 2. Installer Vercel CLI (optionnel mais recommandé)

```bash
npm install -g vercel
```

### 3. Créer le fichier de configuration Frontend

Dans `agent-dashboard-frontend`, créer `.env.production` :

```bash
cd agent-dashboard-frontend
echo "VITE_API_URL=https://tableau-agent-backend.onrender.com/api" > .env.production
```

⚠️ **Remplacez par VOTRE URL Render** !

### 4. Build local pour tester (optionnel)

```bash
npm run build
npm run preview
```

Ouvrir http://localhost:4173 et tester que tout fonctionne.

### 5. Déployer sur Vercel

#### Option A : Via l'Interface Web (Plus Simple)

1. Aller sur https://vercel.com/dashboard
2. Cliquer **"Add New..."** → **"Project"**
3. Importer votre repo GitHub
4. Configuration :
   - **Framework Preset** : `Vite`
   - **Root Directory** : `agent-dashboard-frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
5. **Environment Variables** → Ajouter :
   ```
   VITE_API_URL = https://tableau-agent-backend.onrender.com/api
   ```
6. Cliquer **"Deploy"**

#### Option B : Via CLI (Plus Rapide)

```bash
cd agent-dashboard-frontend
vercel
```

Répondre aux questions :
```
? Set up and deploy? Y
? Which scope? (votre compte)
? Link to existing project? N
? Project name? tableau-agent-frontend
? In which directory? ./
? Auto-detect settings? Y
? Override settings? N
```

Puis :
```bash
vercel env add VITE_API_URL
# Entrer: https://tableau-agent-backend.onrender.com/api

vercel --prod
```

### 6. Votre application est LIVE ! 🎉

Vercel vous donnera une URL comme :
```
https://tableau-agent-frontend.vercel.app
```

---

## ✅ ÉTAPE 4: Vérification Post-Déploiement (5 min)

### 1. Tester le Backend

Ouvrir dans le navigateur :
```
https://tableau-agent-backend.onrender.com
```

Vous devriez voir un message ou une page.

### 2. Tester le Frontend

1. Ouvrir : `https://votre-app.vercel.app`
2. Se connecter avec : `agent1@example.com` / `password123`
3. Vérifier que :
   - ✅ Login fonctionne
   - ✅ Dashboard affiche les stats
   - ✅ Pas d'erreur dans la console (F12)

### 3. Tester les Fonctionnalités

- ✅ Navigation entre pages
- ✅ Ajout d'un utilisateur
- ✅ Recherche dans Dashboard
- ✅ Dépôt avec recherche distributeur
- ✅ Pas d'erreur "removeChild"

---

## 🐛 DÉPANNAGE

### Erreur CORS

**Symptôme** : Erreur "CORS policy" dans la console

**Solution** : Ajouter dans `backend/server.js` (après la ligne des imports) :

```javascript
const corsOptions = {
  origin: [
    'https://votre-app.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

Puis redéployer le backend :
```bash
git add .
git commit -m "Fix CORS"
git push
```

Render redéploiera automatiquement.

### Backend "Cold Start"

**Symptôme** : Premier chargement très lent (30-60 secondes)

**Cause** : Render met en veille les apps gratuites après 15 min d'inactivité

**Solution** : 
- Attendre 30 secondes au premier chargement
- Ou upgrader vers un plan payant (7$/mois)

### Erreur 401 Unauthorized

**Symptôme** : Impossible de se connecter

**Solution** :
1. Vérifier que `JWT_SECRET` est identique backend et frontend
2. Vérifier que MongoDB est accessible (whitelist IP sur Atlas)
3. Recréer les users : `node backend/seed_data.js`

---

## 📊 RÉCAPITULATIF

### URLs de votre Application

| Service | URL | Coût |
|---------|-----|------|
| **Frontend** | https://votre-app.vercel.app | Gratuit |
| **Backend** | https://tableau-agent-backend.onrender.com | Gratuit |
| **Database** | MongoDB Atlas | Gratuit (512 MB) |

### Identifiants de Test

```
Email: agent1@example.com
Password: password123
```

### Commandes Utiles

**Redéployer le Frontend :**
```bash
cd agent-dashboard-frontend
vercel --prod
```

**Redéployer le Backend :**
```bash
git add .
git commit -m "Update backend"
git push
```
(Render redéploie automatiquement)

**Voir les logs Backend :**
```bash
# Sur Render.com → votre service → onglet "Logs"
```

---

## 🎯 PROCHAINES ÉTAPES

### 1. Personnaliser le Domaine (Optionnel)

**Vercel** :
- Aller dans Project Settings → Domains
- Ajouter votre domaine personnalisé (gratuit)

**Render** :
- Aller dans Settings → Custom Domains
- Ajouter votre domaine (gratuit)

### 2. Monitoring

**Vercel Analytics** (gratuit) :
- Aller dans Project → Analytics
- Activer Web Analytics

**Render** :
- Les logs sont disponibles dans l'onglet "Logs"

### 3. Sauvegardes MongoDB

**MongoDB Atlas** :
- Aller dans Clusters → Backup
- Configurer des snapshots automatiques (gratuit)

---

## 🎉 FÉLICITATIONS !

Votre application est maintenant **LIVE** en production ! 🚀

**Partagez votre application :**
- Frontend : `https://votre-app.vercel.app`
- Envoyez le lien à vos utilisateurs

**Support :**
- Render : https://render.com/docs
- Vercel : https://vercel.com/docs
- MongoDB Atlas : https://docs.atlas.mongodb.com

---

**Besoin d'aide ?** Consultez les logs :
- Render : Onglet "Logs" dans votre service
- Vercel : Onglet "Deployments" → cliquer sur le deployment → "View Function Logs"
- MongoDB : Atlas → Clusters → Metrics

**Temps total de déploiement : ~20 minutes** ⏱️

✅ Votre application est maintenant accessible **24/7** dans le monde entier !
