# 🔧 Dépannage MongoDB Atlas

## ❌ Erreur Actuelle
```
MongooseServerSelectionError: ReplicaSetNoPrimary
```

**Signification** : Le cluster MongoDB Atlas ne répond pas.

---

## ✅ Solution Rapide (3 minutes)

### 1️⃣ Vérifier le Cluster Atlas

**URL** : https://cloud.mongodb.com/

#### A. Cluster en Pause ?
- Si le statut est **PAUSED** → Cliquer **Resume**
- Attendre 2-3 minutes

#### B. Accès Réseau Configuré ?
1. Menu **Network Access** (gauche)
2. Vérifier qu'il y a : **0.0.0.0/0** (Allow from Anywhere)
3. Si absent :
   - Cliquer **Add IP Address**
   - Choisir **Allow Access from Anywhere**
   - IP : `0.0.0.0/0`
   - Cliquer **Confirm**

#### C. Utilisateur Existe ?
1. Menu **Database Access** (gauche)
2. Vérifier que **agent_dashboard_db** existe
3. Si absent ou mot de passe oublié :
   - Cliquer **Add New Database User**
   - Username : `admin`
   - Password : `admin123`
   - Database User Privileges : **Read and write to any database**
   - Cliquer **Add User**

---

### 2️⃣ Obtenir la Nouvelle Connection String

1. **Database** (menu gauche)
2. Cliquer **Connect** sur votre cluster
3. Choisir **Connect your application**
4. **Driver** : Node.js
5. **Copier** la connection string :
   ```
   mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### 3️⃣ Mettre à Jour le .env

**Fichier** : `backend\.env`

```env
# Remplacer cette ligne :
MONGO_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/agent-dashboard?retryWrites=true&w=majority
```

**⚠️ Important** :
- Remplacer `admin:admin123` par vos vrais credentials
- Remplacer `cluster0.xxxxx` par votre vrai cluster ID
- Ajouter `/agent-dashboard` avant le `?`

**Exemple complet** :
```env
MONGO_URI=mongodb+srv://admin:admin123@cluster0.abc123.mongodb.net/agent-dashboard?retryWrites=true&w=majority
```

---

### 4️⃣ Recréer les Données

Une fois connecté, recréer l'agent :

```powershell
cd c:\Tableau-de-bord-agent\backend
node create-agent.js
```

**Résultat attendu** :
```
✅ Agent créé avec succès !
📧 Email : agent@example.com
🔑 Mot de passe : test123
```

---

## 🆘 Alternative : MongoDB Local

Si Atlas ne fonctionne pas, utilisez MongoDB en local :

### Option 1 : MongoDB Compass (Graphique)
1. **Télécharger** : https://www.mongodb.com/try/download/compass
2. **Installer** et lancer
3. **Modifier `.env`** :
   ```env
   # Commenter Atlas
   # MONGO_URI=mongodb+srv://...
   
   # Décommenter Local
   MONGO_URI=mongodb://localhost:27017/agent-dashboard
   ```

### Option 2 : MongoDB Community Server
1. **Télécharger** : https://www.mongodb.com/try/download/community
2. **Installer** en tant que service
3. **Modifier `.env`** (comme ci-dessus)

---

## 🧪 Test de Connexion

Après modification du `.env` :

```powershell
# Terminal 1 - Backend
cd c:\Tableau-de-bord-agent\backend
npm start
```

**✅ Succès** :
```
Serveur démarré sur le port 5000
Connecté à MongoDB ✓
```

**❌ Échec** :
```
Erreur de connexion à MongoDB
```
→ Vérifier à nouveau les étapes ci-dessus

---

## 📞 Checklist de Dépannage

- [ ] Cluster Atlas actif (pas PAUSED)
- [ ] Network Access : 0.0.0.0/0 configuré
- [ ] Database User créé avec mot de passe correct
- [ ] Connection string correcte dans .env
- [ ] Mot de passe encodé (@ → %40)
- [ ] `/agent-dashboard` ajouté dans l'URL
- [ ] Backend redémarré après modification .env

---

## 🎯 En Cas de Blocage

**Si Atlas ne fonctionne toujours pas** :

1. **Créer un NOUVEAU cluster** (gratuit)
2. **Utiliser des credentials simples** : `admin` / `admin123`
3. **Suivre le guide** : `CONFIGURER_ATLAS.md`

**OU**

**Utiliser MongoDB local** (plus rapide pour tester)

---

## ✅ Une Fois Connecté

Vous verrez :
```
Serveur démarré sur le port 5000
Connecté à MongoDB
```

Puis créer l'agent :
```powershell
node create-agent.js
```

Puis démarrer le frontend :
```powershell
cd ..\agent-dashboard-frontend
npm run dev
```

**🚀 Application prête sur http://localhost:5173**
