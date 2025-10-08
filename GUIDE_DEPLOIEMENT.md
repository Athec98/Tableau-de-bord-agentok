# 🚀 Guide de Déploiement - Tableau de Bord Agent

## ⚡ Déploiement Rapide (5 minutes)

### Étape 1: Préparer le Backend

```bash
cd backend

# 1. Vérifier les variables d'environnement
# Éditer .env avec vos credentials MongoDB Atlas

# 2. Installer les dépendances (si pas déjà fait)
npm install

# 3. Tester localement
npm start
# ✅ Doit afficher: "Serveur démarré sur le port 5000"
```

### Étape 2: Préparer le Frontend

```bash
cd ../agent-dashboard-frontend

# 1. Créer .env.production
echo "VITE_API_URL=https://votre-api-production.com/api" > .env.production

# 2. Installer les dépendances (si pas déjà fait)
npm install

# 3. Build production
npm run build

# 4. Test local du build
npm run preview
# ✅ Ouvrir http://localhost:4173 et tester
```

### Étape 3: Vérification Critique

**AVANT de déployer, vérifier:**

1. ✅ Pas d'erreur "removeChild" dans la console
2. ✅ Les dialogs s'ouvrent/ferment sans erreur
3. ✅ Navigation entre pages fonctionne
4. ✅ Rechargement (F5) ne cause pas d'erreur
5. ✅ Backend répond correctement

### Étape 4: Déploiement Backend

#### Option A: Vercel (Recommandé)
```bash
cd backend
npm install -g vercel
vercel
# Suivre les instructions
# Ajouter les variables d'environnement dans le dashboard Vercel
```

#### Option B: Render.com
1. Connecter votre repo GitHub
2. Créer un nouveau "Web Service"
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Ajouter les variables d'environnement

#### Option C: Heroku
```bash
cd backend
heroku create votre-app-backend
heroku config:set MONGO_URI="votre-connection-string"
heroku config:set JWT_SECRET="votre-secret"
git push heroku main
```

### Étape 5: Déploiement Frontend

#### Option A: Vercel (Recommandé)
```bash
cd agent-dashboard-frontend
vercel
# Ajouter VITE_API_URL dans les variables d'environnement
```

#### Option B: Netlify
```bash
cd agent-dashboard-frontend
npm install -g netlify-cli
netlify deploy --prod --dir=dist
# Ajouter VITE_API_URL=https://votre-backend.com/api
```

#### Option C: GitHub Pages
```bash
# Dans package.json, ajouter:
# "homepage": "https://username.github.io/repo-name"
npm run build
npm install -g gh-pages
gh-pages -d dist
```

## 🔧 Configuration Post-Déploiement

### 1. Configurer CORS sur le Backend

Éditer `backend/server.js`:
```javascript
const corsOptions = {
  origin: [
    'https://votre-frontend.vercel.app',
    'https://votre-frontend.netlify.app'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

### 2. Variables d'Environnement Production

**Backend (.env):**
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=votre-secret-production-complexe
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://votre-frontend.com
```

**Frontend (.env.production):**
```
VITE_API_URL=https://votre-backend.com/api
```

## 🧪 Tests Post-Déploiement

### Checklist Critique

1. **Test Connexion**
   - [ ] Aller sur votre-frontend.com
   - [ ] Se connecter avec: `agent1@example.com` / `password123`
   - [ ] Vérifier que le dashboard s'affiche

2. **Test Portals**
   - [ ] Ouvrir Dialog "Ajouter utilisateur"
   - [ ] Fermer et rouvrir
   - [ ] Ouvrir console (F12)
   - [ ] **AUCUNE erreur "removeChild" ne doit apparaître**

3. **Test Navigation**
   - [ ] Dashboard → Users → Dashboard
   - [ ] Pas d'erreur console

4. **Test Rechargement**
   - [ ] F5 sur différentes pages
   - [ ] Pas d'erreur console

5. **Test API**
   - [ ] Créer un utilisateur
   - [ ] Modifier un utilisateur
   - [ ] Vérifier les stats

## 🐛 Problèmes Courants

### Erreur: "Network Error" ou CORS
```bash
# Backend: Vérifier CORS_ORIGIN dans .env
# Frontend: Vérifier VITE_API_URL dans .env.production
```

### Erreur: "removeChild" persiste
```bash
# 1. Vider le cache navigateur (Ctrl+Shift+Delete)
# 2. Rebuild frontend: npm run build
# 3. Vérifier que globals.css est chargé
# 4. Vérifier que portal-root existe dans dist/index.html
```

### Erreur: "Unauthorized" / 401
```bash
# Vérifier JWT_SECRET côté backend
# Vérifier que le token est bien stocké
# Tester en local d'abord
```

## 📊 Monitoring Production

### Logs Backend
```bash
# Vercel
vercel logs

# Render
# Voir dans le dashboard

# Heroku
heroku logs --tail
```

### Logs Frontend
- Utiliser Google Analytics ou Sentry
- Vérifier les erreurs dans la console navigateur des users

## 🎯 Checklist Finale

- [ ] Backend déployé et accessible
- [ ] Frontend déployé et accessible
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] Base de données MongoDB Atlas accessible
- [ ] Tests de connexion OK
- [ ] Tests des dialogs OK (pas d'erreur removeChild)
- [ ] Tests de navigation OK
- [ ] Monitoring en place

## 📞 Support

En cas de problème:
1. Vérifier les logs backend
2. Vérifier la console navigateur
3. Vérifier les variables d'environnement
4. Tester en local d'abord
5. Consulter `SOLUTION_DEFINITIVE_PORTAL.md`

## 🏁 Succès !

Si tous les tests passent:
✅ **Votre application est prête pour la production !**

URL Frontend: `https://votre-app.com`
URL Backend: `https://votre-api.com`
Identifiants test: `agent1@example.com` / `password123`
