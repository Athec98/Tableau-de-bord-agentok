# 🔧 Correction : MongoDB Non Connecté

## ❌ Erreur Actuelle
```
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
```

**Cause** : MongoDB n'est pas démarré sur le port 27017.

---

## ✅ Solutions (Choisissez-en UNE)

### 🚀 Option 1 : Installer MongoDB Localement (Recommandé pour le développement)

#### Windows

1. **Télécharger MongoDB Community Server** :
   - URL : https://www.mongodb.com/try/download/community
   - Version : 7.x ou 8.x
   - Platform : Windows

2. **Installer** :
   - Exécuter le fichier `.msi`
   - Suivre les instructions
   - ✅ Cocher "Install MongoDB as a Service"

3. **Vérifier l'installation** :
   ```powershell
   # Vérifier si MongoDB est en cours d'exécution
   Get-Service -Name MongoDB
   
   # Si le service n'est pas démarré
   net start MongoDB
   ```

4. **Démarrer manuellement (si pas installé comme service)** :
   ```powershell
   # Ouvrir un nouveau terminal en ADMIN
   mongod
   ```

5. **Redémarrer le backend** :
   ```powershell
   cd c:\Tableau-de-bord-agent\backend
   npm start
   ```

---

### ☁️ Option 2 : MongoDB Atlas (Cloud - GRATUIT)

**Avantages** :
- ✅ Gratuit (500 MB)
- ✅ Pas d'installation
- ✅ Accessible de partout
- ✅ Backups automatiques

#### Étapes

1. **Créer un compte** :
   - https://www.mongodb.com/cloud/atlas/register

2. **Créer un cluster gratuit** :
   - Cliquer "Build a Database"
   - Choisir "FREE" (M0 Sandbox)
   - Région : Paris (Europe West) ou proche
   - Cliquer "Create"

3. **Créer un utilisateur** :
   - Username : `admin`
   - Password : `admin123` (ou autre, notez-le)
   - Cliquer "Create User"

4. **Configurer l'accès réseau** :
   - Cliquer "Add IP Address"
   - Choisir "Allow Access from Anywhere" : `0.0.0.0/0`
   - Cliquer "Add Entry"

5. **Récupérer la connection string** :
   - Cliquer "Connect"
   - Choisir "Connect your application"
   - Copier la connection string :
     ```
     mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

6. **Modifier `.env`** :
   Ouvrir `c:\Tableau-de-bord-agent\backend\.env` et remplacer :
   ```env
   # Commenter l'ancienne ligne
   # MONGO_URI=mongodb://localhost:27017/agent-dashboard
   
   # Coller votre connection string (remplacer <password> par votre mot de passe)
   MONGO_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/agent-dashboard?retryWrites=true&w=majority
   ```

7. **Redémarrer le backend** :
   ```powershell
   cd c:\Tableau-de-bord-agent\backend
   npm start
   ```

---

### 🛠️ Option 3 : MongoDB avec Docker (Pour les utilisateurs avancés)

```powershell
# Installer Docker Desktop : https://www.docker.com/products/docker-desktop/

# Démarrer MongoDB avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Arrêter MongoDB
docker stop mongodb

# Redémarrer MongoDB
docker start mongodb
```

---

## 🧪 Vérifier que MongoDB Fonctionne

### Pour MongoDB Local
```powershell
# Tester la connexion
mongosh

# Ou
mongo
```

Si ça fonctionne, vous verrez :
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/
```

### Pour MongoDB Atlas
- Redémarrez simplement le backend
- Si la connection string est correcte, ça devrait fonctionner

---

## ✅ Après Correction

Une fois MongoDB démarré, vous devriez voir :
```
Serveur démarré sur le port 5000
Connecté à MongoDB ✓
```

Ensuite, démarrez le frontend :
```powershell
cd c:\Tableau-de-bord-agent\agent-dashboard-frontend
npm run dev
```

---

## 🚨 Problèmes Courants

### Erreur : "mongod n'est pas reconnu"
**Solution** : Ajouter MongoDB au PATH Windows
1. Rechercher "Variables d'environnement"
2. Modifier la variable `PATH`
3. Ajouter : `C:\Program Files\MongoDB\Server\7.0\bin`
4. Redémarrer le terminal

### Erreur : "Access Denied"
**Solution** : Ouvrir PowerShell en **Administrateur**

### Port 27017 déjà utilisé
```powershell
# Trouver le processus
netstat -ano | findstr :27017

# Tuer le processus (remplacer PID par le numéro affiché)
taskkill /PID <PID> /F
```

---

## 📞 Aide Supplémentaire

Si vous rencontrez des problèmes :
1. Vérifiez les logs du backend
2. Testez `mongosh` ou `mongo` dans le terminal
3. Vérifiez que le port 27017 n'est pas bloqué par un firewall
4. Utilisez MongoDB Atlas (Option 2) si l'installation locale pose problème

---

## 🎯 Recommandation

Pour débuter rapidement : **Utilisez MongoDB Atlas (Option 2)**
- Pas d'installation
- Fonctionne immédiatement
- Gratuit pour toujours (500 MB)
