# 🚀 Démarrage Rapide - 3 Étapes

## Étape 1 : Démarrer les Serveurs

Ouvrez PowerShell et exécutez :

```powershell
cd C:\Tableau-de-bord-agent
.\start-all.ps1
```

**OU manuellement (2 terminaux) :**

Terminal 1 - Backend :
```powershell
cd C:\backend
node server.js
```

Terminal 2 - Frontend :
```powershell
cd C:\Tableau-de-bord-agent\agent-dashboard-frontend
npm run dev
```

---

## Étape 2 : Accéder à l'Application

Le navigateur devrait s'ouvrir automatiquement à :
### http://localhost:5173

Si ce n'est pas le cas, copiez-collez cette URL dans votre navigateur.

---

## Étape 3 : Se Connecter

Sur la page de login, utilisez :

```
📧 Email : agent1@example.com
🔑 Mot de passe : password123
```

**Ou avec n'importe quel autre agent de test (voir IDENTIFIANTS_TEST.md)**

---

## ✅ C'est Tout !

Vous êtes maintenant connecté au tableau de bord.

### Fonctionnalités Disponibles

- **Dashboard** : Statistiques en temps réel
- **Utilisateurs** : Gérer clients, agents, distributeurs
- **Dépôt** : Créer des dépôts vers distributeurs
- **Historique** : Voir toutes les transactions
- **Annulation** : Annuler des transactions

---

## 🆘 Problème ?

### "Identifiants invalides"
→ Vérifiez que le backend est bien démarré (terminal 1)
→ Utilisez exactement : `agent1@example.com` / `password123`

### "Cannot connect to backend"
→ Le backend n'est pas démarré
→ Lancez : `cd C:\backend && node server.js`

### Page blanche
→ Rechargez la page (F5)
→ Vérifiez que le frontend est démarré (terminal 2)

### Vérifier les données
```powershell
cd C:\backend
node check_data.js
```
Vous devriez voir : 18 utilisateurs, 30 transactions

---

## 📚 Plus d'Informations

- **Guide complet** : `GUIDE_CONNEXION_FRONTEND_BACKEND.md`
- **Tous les identifiants** : `IDENTIFIANTS_TEST.md`
- **Récapitulatif technique** : `RECAPITULATIF_CONNEXION.md`

**Bon développement ! 🎉**
