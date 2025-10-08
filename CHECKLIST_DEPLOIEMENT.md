# ✅ CHECKLIST DE DÉPLOIEMENT

Cochez au fur et à mesure. **Temps total: ~10 minutes**

---

## 🧪 Phase 1: Test Local (2 min)

- [ ] Backend démarré (`cd backend && npm start`)
- [ ] Frontend démarré (`cd agent-dashboard-frontend && npm run dev`)
- [ ] Ouvert http://localhost:5173
- [ ] Connexion OK avec `agent1@example.com` / `password123`
- [ ] Console (F12) ouverte
- [ ] **AUCUNE erreur "removeChild" dans la console** ✅
- [ ] Navigation Dashboard → Users → fonctionne
- [ ] Dialog "Ajouter utilisateur" → ouvre/ferme sans erreur
- [ ] F5 (recharger) → pas d'erreur console

---

## 🏗️ Phase 2: Build Production (1 min)

- [ ] `npm run build` exécuté
- [ ] Dossier `dist` créé
- [ ] `npm run preview` exécuté
- [ ] Testé sur http://localhost:4173
- [ ] Tous les tests ci-dessus refaits sur le preview
- [ ] **Build fonctionne parfaitement** ✅

---

## 🌐 Phase 3: Déploiement Backend (3 min)

- [ ] Compte Render.com créé
- [ ] "New +" → "Web Service" cliqué
- [ ] Configuration:
  - [ ] Name: `tableau-agent-backend`
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
- [ ] Variables d'environnement ajoutées:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRE = 7d`
  - [ ] `NODE_ENV = production`
- [ ] "Create Web Service" cliqué
- [ ] **URL backend copiée**: `https://______________.onrender.com`
- [ ] Backend déployé avec succès ✅

---

## 🚀 Phase 4: Déploiement Frontend (2 min)

- [ ] Vercel CLI installé (`npm install -g vercel`)
- [ ] Fichier `.env.production` créé
- [ ] `VITE_API_URL` configuré avec l'URL backend
- [ ] `vercel` exécuté
- [ ] Questions répondues:
  - [ ] Set up and deploy? **Y**
  - [ ] Link to existing? **N**
  - [ ] Project name? **tableau-agent-frontend**
  - [ ] Directory? **./

**
  - [ ] Auto-detect? **Y**
- [ ] Variable d'environnement ajoutée (`vercel env add VITE_API_URL`)
- [ ] `vercel --prod` exécuté
- [ ] **URL frontend copiée**: `https://______________.vercel.app`
- [ ] Frontend déployé avec succès ✅

---

## ✅ Phase 5: Vérification Production (1 min)

- [ ] Ouvert l'URL frontend en production
- [ ] Connexion OK: `agent1@example.com` / `password123`
- [ ] Console (F12) ouverte
- [ ] **AUCUNE erreur dans la console** ✅
- [ ] **AUCUNE erreur "removeChild"** ✅
- [ ] **AUCUNE erreur CORS** ✅
- [ ] Navigation entre pages → OK
- [ ] Dialog ouvrir/fermer → OK
- [ ] F5 recharger → OK
- [ ] Stats affichées correctement
- [ ] Backend répond correctement

---

## 🎯 Phase 6: Configuration CORS (si nécessaire)

Si erreur CORS:

- [ ] Backend `.env` mis à jour avec `CORS_ORIGIN=https://votre-frontend.vercel.app`
- [ ] Backend redéployé sur Render
- [ ] Frontend retesté
- [ ] CORS résolu ✅

---

## 📊 Phase 7: Test Final Complet (2 min)

### Fonctionnalités Critiques

- [ ] **Connexion/Déconnexion**
  - [ ] Login fonctionne
  - [ ] Logout fonctionne
  - [ ] Token persisté correctement

- [ ] **Dashboard**
  - [ ] Stats affichées (Clients, Agents, Distributeurs)
  - [ ] Recherche utilisateur fonctionne
  - [ ] Dialog détails utilisateur s'ouvre

- [ ] **Gestion Utilisateurs**
  - [ ] Liste utilisateurs affichée
  - [ ] Filtres rôle fonctionnent
  - [ ] Recherche fonctionne
  - [ ] Dialog "Ajouter utilisateur" fonctionne
  - [ ] Dialog "Modifier utilisateur" fonctionne
  - [ ] Bloquer/Débloquer fonctionne

- [ ] **Navigation**
  - [ ] Tous les liens du menu fonctionnent
  - [ ] Sidebar ouvrir/fermer fonctionne
  - [ ] Mode sombre fonctionne

- [ ] **Performance**
  - [ ] Chargement rapide (<3s)
  - [ ] Pas de lag visible
  - [ ] Animations fluides

---

## 🏆 SUCCÈS FINAL

- [ ] **Application 100% fonctionnelle en production** ✅
- [ ] **Aucune erreur console** ✅
- [ ] **Tous les tests passent** ✅
- [ ] **URL notées:**
  - Frontend: `https://________________________.vercel.app`
  - Backend: `https://________________________.onrender.com`
  - Database: MongoDB Atlas ✅

---

## 📝 Post-Déploiement

- [ ] URLs ajoutées à la documentation
- [ ] Identifiants de test documentés
- [ ] Screenshot de l'app pris
- [ ] Équipe/Client notifié
- [ ] Monitoring configuré (optionnel)
- [ ] Domaine personnalisé configuré (optionnel)

---

## 🎉 FÉLICITATIONS !

Votre **Tableau de Bord Agent** est maintenant **LIVE** en production ! 🚀

**Identifiants de démo:**
- Email: `agent1@example.com`
- Password: `password123`

---

## 📞 Support

En cas de problème, consulter:
- 🚀 `START_HERE.md`
- 📖 `GUIDE_DEPLOIEMENT.md`
- 🔧 `SOLUTION_DEFINITIVE_PORTAL.md`
- 📋 `COMMANDES_DEPLOIEMENT.txt`

---

*Checklist créée le: 08/10/2025*
