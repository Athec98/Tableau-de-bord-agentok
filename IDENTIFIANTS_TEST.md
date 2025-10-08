# 🔐 Identifiants de Test

## ✅ Base de Données Peuplée

La base de données contient maintenant :
- **18 utilisateurs** (8 agents, 5 distributeurs, 5 clients)
- **30 transactions** de test

---

## 👤 Connexion Frontend

### Option 1 - Agent Principal
```
Email: agent1@example.com
Mot de passe: password123
```

### Option 2 - Autres Agents
```
agent2@example.com → password123
agent3@example.com → password123
agent4@example.com → password123
agent5@example.com → password123
agent6@example.com → password123
```

### Option 3 - Par Numéro de Compte
Vous pouvez aussi vous connecter avec le numéro de compte généré.
Vérifiez dans le frontend après connexion avec l'email.

---

## 📊 Données de Test Disponibles

### Distributeurs (5)
- Mamadou Diallo
- Fatou Ndiaye
- Ousmane Sow
- Aissatou Ba
- Ibrahima Fall

Tous avec : `password123`

### Clients (5)
- Alioune Diop
- Ndeye Kane
- Seydou Seck
- Awa Toure
- Lamine Camara

Tous avec : `password123`

### Transactions (30)
- Statuts variés : complété, en attente, annulé
- Types : dépôt, annulation
- Montants : de 1 000 F à 100 000 F
- Dates : réparties sur les 30 derniers jours

---

## 🚀 Comment Tester

1. **Démarrer les serveurs**
   ```powershell
   cd C:\Tableau-de-bord-agent
   .\start-all.ps1
   ```

2. **Se connecter**
   - URL: http://localhost:5173
   - Email: `agent1@example.com`
   - Mot de passe: `password123`

3. **Tester les fonctionnalités**
   - ✅ Dashboard : Voir les statistiques
   - ✅ Utilisateurs : Liste, recherche, blocage, suppression
   - ✅ Dépôt : Créer un dépôt vers un distributeur
   - ✅ Historique : Voir les transactions
   - ✅ Annulation : Annuler une transaction

---

## 🔄 Réinitialiser les Données

Si vous voulez recréer toutes les données de test :

```powershell
cd C:\backend
node seed_data.js
```

**⚠️ Attention** : Cela supprimera TOUTES les données existantes !

---

## 🆘 En Cas de Problème

### "Identifiants invalides"
- Vérifiez que le backend est démarré
- Vérifiez l'orthographe (sensible à la casse)
- Essayez : `agent1@example.com` / `password123`

### "Cannot connect to backend"
- Vérifiez que `node server.js` tourne sur le port 5000
- Testez : http://localhost:5000

### Vérifier les données en base
```powershell
cd C:\backend
node check_data.js
```

---

## 📝 Notes Importantes

- Le mot de passe par défaut pour TOUS les utilisateurs de test est : **password123**
- Les agents peuvent se connecter avec leur email OU leur numéro de compte
- 6 agents sont actifs, 2 sont inactifs (pour tester le blocage)
- Les transactions ont des dates variées pour tester les filtres

**🎉 Bonne utilisation !**
