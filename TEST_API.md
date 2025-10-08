# 🧪 Test des APIs - Guide de Débogage

## 🔍 Problèmes Identifiés

### 1. Dépôt - 404 Error
**Cause possible** : Route ou authentification

### 2. Historique - Page Blanche  
**Cause possible** : Ordre des routes ou format de données

---

## ✅ Corrections Appliquées

### Backend Routes (C:\backend\routes\transactions.js)
```javascript
// ✅ L'ORDRE DES ROUTES EST CRITIQUE !
router.post("/deposit", auth, ...);
router.get("/history", auth, ...);  // AVANT /:id
router.get("/search", auth, ...);
router.get("/", auth, ...);
router.put("/cancel/:id", auth, ...);
router.delete("/:id", auth, ...);    // APRÈS /history
```

**Pourquoi ?** Express lit les routes dans l'ordre. Si `/:id` est avant `/history`, Express pense que "history" est un ID !

### Contrôleur Transactions
- ✅ Formatage des données pour l'historique
- ✅ Ajout des champs `id`, `agentNom`, `distributeurNom`

### Contrôleur Users  
- ✅ Filtrage par rôle (`?role=distributeur`)
- ✅ Ajout du champ `id` pour compatibilité

---

## 🚀 Redémarrage Requis

**IMPORTANT** : Après avoir modifié le backend, vous DEVEZ redémarrer :

```powershell
# 1. Arrêter le backend (Ctrl+C dans le terminal backend)

# 2. Redémarrer
cd C:\backend
node server.js
```

---

## 🧪 Tests Manuels

### Test 1 : Backend accessible
```powershell
curl http://localhost:5000
# Doit retourner: "API Agent Dashboard"
```

### Test 2 : Login et obtenir le token
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"identifier\":\"agent1@example.com\",\"password\":\"password123\"}'
```

**Copier le token** de la réponse pour les tests suivants.

### Test 3 : Liste des distributeurs
```powershell
# Remplacer YOUR_TOKEN par le token obtenu
curl http://localhost:5000/api/users?role=distributeur `
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 4 : Historique
```powershell
curl http://localhost:5000/api/transactions/history `
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 5 : Dépôt
```powershell
# Remplacer DISTRIBUTOR_ID par un ID réel
curl -X POST http://localhost:5000/api/transactions/deposit `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -d '{\"destinataireId\":\"DISTRIBUTOR_ID\",\"montant\":1000,\"devise\":\"F\"}'
```

---

## 🔧 Vérifications Frontend

### Dans la Console du Navigateur (F12)

1. **Vérifier le token**
```javascript
localStorage.getItem('token')
// Doit retourner une longue chaîne de caractères
```

2. **Vérifier l'intercepteur axios**
Regardez l'onglet **Network** :
- Cliquez sur une requête API
- Onglet **Headers**
- Vérifiez que `Authorization: Bearer ...` est présent

---

## ⚠️ Problèmes Courants

### Erreur 404 sur /deposit
**Causes** :
1. ❌ Backend pas redémarré après modification
2. ❌ Route mal définie
3. ❌ Typo dans l'URL

**Solution** :
```powershell
cd C:\backend
# Ctrl+C puis
node server.js
```

### Erreur 401 Unauthorized
**Causes** :
1. ❌ Token expiré (durée: 1h)
2. ❌ Token mal envoyé
3. ❌ JWT_SECRET différent

**Solution** :
- Se déconnecter et se reconnecter
- Vérifier `.env` : `JWT_SECRET=supersecretjwtkey`

### Page Blanche (Historique)
**Causes** :
1. ❌ Erreur JavaScript (voir console)
2. ❌ Données mal formatées
3. ❌ Route `/history` confondue avec `/:id`

**Solution** :
- Ouvrir Console (F12)
- Vérifier les erreurs
- Backend redémarré ?

### Select Distributeur Vide
**Causes** :
1. ❌ Aucun distributeur en base
2. ❌ Requête API échoue
3. ❌ Filtre `?role=distributeur` ne fonctionne pas

**Solution** :
```powershell
cd C:\backend
node check_data.js
# Doit afficher au moins 5 distributeurs
```

Si aucun distributeur :
```powershell
node seed_data.js
```

---

## 📋 Checklist de Débogage

Avant de tester, vérifiez :

- [ ] Backend démarré (`node server.js`)
- [ ] Frontend démarré (`npm run dev`)
- [ ] Backend répond (`curl http://localhost:5000`)
- [ ] Token présent dans localStorage
- [ ] Données en base (`node check_data.js`)
- [ ] Console navigateur sans erreurs
- [ ] Network tab montre requêtes avec statut 200

---

## 🎯 Logs à Vérifier

### Backend (Terminal node server.js)
```
Serveur démarré sur le port 5000
Connecté à MongoDB
```

### Frontend (Console Navigateur F12)
```
✅ Pas d'erreur rouge
✅ Requêtes API retournent 200 ou 201
❌ Erreur 404 = route introuvable
❌ Erreur 401 = token invalide
❌ Erreur 500 = erreur serveur
```

---

## 🔄 Redémarrage Complet

Si rien ne fonctionne :

```powershell
# 1. Arrêter TOUT (Ctrl+C dans les 2 terminaux)

# 2. Terminal 1 - Backend
cd C:\backend
node server.js

# 3. Attendre "Serveur démarré sur le port 5000"

# 4. Terminal 2 - Frontend  
cd C:\Tableau-de-bord-agent\agent-dashboard-frontend
npm run dev

# 5. Attendre "Local: http://localhost:5173/"

# 6. Ouvrir http://localhost:5173

# 7. Se connecter
# Email: agent1@example.com
# Mot de passe: password123

# 8. Tester les fonctionnalités
```

---

## 📞 Commandes Utiles

```powershell
# Vérifier données
cd C:\backend
node check_data.js

# Réinitialiser données
node seed_data.js

# Voir les utilisateurs
# (dans MongoDB Compass ou shell)

# Tester une route directement
curl http://localhost:5000/api/users `
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ Quand Tout Fonctionne

Vous devriez pouvoir :
- ✅ Se connecter
- ✅ Voir le dashboard
- ✅ Voir la liste des utilisateurs
- ✅ Sélectionner un distributeur dans Dépôt
- ✅ Créer un dépôt
- ✅ Voir l'historique des transactions
- ✅ Bloquer/débloquer un utilisateur
- ✅ Rechercher des utilisateurs

**Si un problème persiste, vérifiez les logs backend et la console navigateur !**
