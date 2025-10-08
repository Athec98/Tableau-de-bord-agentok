# Fix - Problème de Connexion "Identifiants invalides"

## Problème
Le message "Identifiants invalides. Veuillez réessayer." s'affichait lors de la tentative de connexion.

## Cause
Le **backend n'était pas démarré** et la **base de données était vide** (aucun utilisateur).

## Solutions Appliquées

### 1. Démarrage du Backend ✅
```bash
cd backend
npm run dev
```
- Backend maintenant actif sur `http://localhost:5000`
- API accessible pour le frontend

### 2. Peuplement de la Base de Données ✅
```bash
cd backend
node seed_data.js
```

**Résultat :**
- ✅ 18 utilisateurs créés
  - 8 agents (6 actifs, 2 inactifs)
  - 5 distributeurs (tous actifs)
  - 5 clients (tous actifs)
- ✅ 30 transactions de test créées
- ✅ Mot de passe par défaut : `password123`

### 3. Mise à Jour des Identifiants de Test ✅
Le composant Login affiche maintenant les **vrais** identifiants :
- **Email:** `agent1@example.com`
- **Mot de passe:** `password123`

## Architecture de l'Authentification

### Frontend (`Login.jsx`)
```javascript
// Envoie les identifiants à l'API
const response = await authAPI.login({
  identifier: formData.identifier, // email ou numeroCompte
  password: formData.password
});
```

### Backend (`authController.js`)
```javascript
// Vérifie les identifiants
if (identifier.includes("@")) {
  user = await User.findOne({ email: identifier });
} else {
  user = await User.findOne({ numeroCompte: identifier });
}

const isMatch = await bcrypt.compare(password, user.password);
```

## Utilisateurs de Test Disponibles

### Agents
- `agent1@example.com` → Moussa Sarr (Actif)
- `agent2@example.com` → Aminata Gueye (Actif)
- `agent3@example.com` → Cheikh Diouf (Actif)
- `agent4@example.com` → Mariama Thiam (Actif)
- `agent5@example.com` → Abdou Cisse (Actif)
- `agent6@example.com` → Khady Sy (Actif)
- `agent7@example.com` → Modou Mbaye (Inactif)
- `agent8@example.com` → Binta Faye (Inactif)

### Distributeurs
- `distributeur1@example.com` → Mamadou Diallo
- `distributeur2@example.com` → Fatou Ndiaye
- `distributeur3@example.com` → Ousmane Sow
- `distributeur4@example.com` → Aissatou Ba
- `distributeur5@example.com` → Ibrahima Fall

### Clients
- `client1@example.com` → Alioune Diop
- `client2@example.com` → Ndeye Kane
- `client3@example.com` → Seydou Seck
- `client4@example.com` → Awa Toure
- `client5@example.com` → Lamine Camara

**Tous les mots de passe :** `password123`

## Comment Tester

1. **Frontend** : `http://localhost:5173`
2. **Backend** : `http://localhost:5000`
3. Utiliser les identifiants de test ci-dessus

## Checklist de Démarrage

Pour éviter ce problème à l'avenir :

- [ ] Démarrer le backend : `npm run dev` (dans `/backend`)
- [ ] Démarrer le frontend : `npm run dev` (dans `/agent-dashboard-frontend`)
- [ ] Vérifier que MongoDB Atlas est accessible
- [ ] Si besoin, recréer les données : `node seed_data.js`

## Vérification Rapide

```bash
# Vérifier que le backend tourne
netstat -ano | findstr :5000

# Vérifier que le frontend tourne
netstat -ano | findstr :5173
```

## En Cas de Problème

1. **Backend ne démarre pas** → Vérifier `.env` et la connexion MongoDB
2. **Erreur de connexion** → Exécuter `node seed_data.js`
3. **Identifiants refusés** → Vérifier que vous utilisez `agent1@example.com` / `password123`
