# Guide de débogage - Page blanche

## 🔍 Étapes de diagnostic RAPIDE

### ⚡ SOLUTION RAPIDE - Testez ceci en premier :

1. **Ouvrez la console du navigateur** (F12)
2. **Faites une action** (ajouter/modifier/supprimer un utilisateur)
3. **Regardez les logs** - vous devriez voir :
   ```
   🔄 Début du chargement des utilisateurs...
   📊 Données reçues: [...]
   ✅ Chargement terminé
   ```

4. **Si vous voyez une erreur rouge** → Lisez le message d'erreur
5. **Si la page devient blanche** → Vérifiez l'onglet "Network" (F12)

---

## 🧪 Test API (Fichier de test inclus)

**Ouvrez le fichier `TEST_API.html` dans votre navigateur** pour tester l'API manuellement.

### Comment utiliser TEST_API.html :
1. Ouvrez `c:\table\TEST_API.html` dans Chrome/Firefox
2. Connectez-vous à l'application
3. Ouvrez la console (F12) et tapez : `localStorage.getItem('token')`
4. Copiez le token et collez-le dans le champ "Token"
5. Cliquez sur "GET /api/users" pour tester

---

## 🔧 Vérifications système

### 1. Vérifier la console du navigateur
Ouvrez la console (F12) et recherchez :
- ❌ Erreurs JavaScript (en rouge)
- ⚠️ Avertissements React
- 🔴 Erreurs réseau (onglet Network)

### 2. Vérifier que le backend est démarré
```bash
# Dans le dossier backend
cd backend
node server.js
```
Le serveur devrait afficher : `Serveur démarré sur le port 5000`

### 3. Vérifier que le frontend est démarré
```bash
# Dans le dossier agent-dashboard-frontend
cd agent-dashboard-frontend
npm run dev
```

### 4. Tester manuellement l'API
Ouvrez un nouvel onglet et testez :
```
http://localhost:5000/api/users
```
Vous devriez voir la liste des utilisateurs en JSON.

## 🐛 Problèmes courants et solutions

### Problème 1 : "Failed to fetch" ou erreur CORS
**Cause** : Le backend n'est pas démarré ou CORS mal configuré

**Solution** :
1. Vérifiez que le backend tourne sur le port 5000
2. Vérifiez dans `backend/server.js` que CORS est activé :
```javascript
app.use(cors());
```

### Problème 2 : "Jeton d'authentification manquant"
**Cause** : Pas de token dans localStorage

**Solution** :
1. Connectez-vous d'abord via la page de login
2. Ou ajoutez temporairement un token dans la console :
```javascript
localStorage.setItem('token', 'votre_token_ici');
```

### Problème 3 : Page blanche après une action
**Cause** : Erreur dans le rendu React

**Solution** : Les corrections ont été appliquées dans :
- ✅ `Users.jsx` : Gestion des toasts et erreurs
- ✅ `usePagination.js` : Protection contre données invalides

### Problème 4 : Données ne se rafraîchissent pas
**Cause** : `loadUsers()` ne se déclenche pas

**Vérification** :
Ajoutez temporairement dans `Users.jsx` après la ligne 116 :
```javascript
console.log('Données chargées:', data);
```

## 🧪 Test rapide

### Test 1 : Vérifier le chargement initial
1. Ouvrez la page Users
2. Ouvrez la console (F12)
3. Vous devriez voir : "Données chargées: [...]"

### Test 2 : Vérifier l'ajout d'utilisateur
1. Cliquez sur "Ajouter Utilisateur"
2. Remplissez le formulaire
3. Cliquez sur "Ajouter"
4. Vérifiez dans la console :
   - Toast "Ajout en cours..."
   - Toast "Utilisateur ajouté avec succès"
   - "Données chargées: [...]"

### Test 3 : Vérifier la suppression
1. Cliquez sur le menu d'un utilisateur
2. Cliquez sur "Supprimer"
3. Confirmez
4. Vérifiez que l'utilisateur disparaît SANS page blanche

## 📋 Checklist de vérification

- [ ] Backend démarré (port 5000)
- [ ] Frontend démarré
- [ ] Connexion réussie (token présent)
- [ ] Console sans erreurs rouges
- [ ] API répond (test manuel)
- [ ] Toasts s'affichent correctement
- [ ] Données se rechargent après action

## 🔧 Si le problème persiste

### Ajoutez des logs de débogage

Dans `Users.jsx`, ajoutez après la ligne 282 (dans `loadUsers`) :
```javascript
console.log('🔄 Rechargement des utilisateurs...');
console.log('📊 Données reçues:', data);
console.log('📊 Nombre d\'utilisateurs:', data?.length);
```

Dans `handleAddUser`, après la ligne 266 :
```javascript
console.log('✅ Utilisateur ajouté, rechargement...');
```

Dans `handleConfirm`, après la ligne 201 :
```javascript
console.log('✅ Action confirmée, rechargement...');
```

### Vérifiez l'état React

Installez React DevTools et vérifiez :
1. L'état `users` contient bien les données
2. L'état `filteredUsers` est à jour
3. L'état `loading` repasse à `false`

## 🆘 Erreurs spécifiques

### "Cannot read property 'map' of undefined"
➡️ Le tableau `users` est undefined
➡️ Vérifiez que l'API retourne bien un tableau

### "Maximum update depth exceeded"
➡️ Boucle infinie dans useEffect
➡️ Vérifiez les dépendances des useEffect

### "Network Error"
➡️ Backend non accessible
➡️ Vérifiez l'URL dans `usersApi.js` : `http://localhost:5000/api`
