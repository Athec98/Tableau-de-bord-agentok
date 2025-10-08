# Configuration de la Base de Données MongoDB

Ce document décrit la structure de la base de données MongoDB, les collections nécessaires et les étapes pour configurer une instance locale.

## 1. Nom de la Base de Données

Le nom de la base de données sera `agent_dashboard_db`.

## 2. Collections et Schémas

Nous allons créer les collections suivantes avec leurs schémas respectifs. Ces schémas sont des exemples simplifiés et pourront être enrichis au fur et à mesure du développement.

### 2.1. Collection `users`

Cette collection stockera les informations des clients, agents et distributeurs.

| Champ           | Type     | Description                                     | Requis | Exemple                       |
| :-------------- | :------- | :---------------------------------------------- | :----- | :---------------------------- |
| `_id`           | ObjectId | Identifiant unique de l'utilisateur             | Oui    | `ObjectId('...')`             |
| `nom`           | String   | Nom de famille de l'utilisateur                 | Oui    | `Doe`                         |
| `prenom`        | String   | Prénom de l'utilisateur                         | Oui    | `John`                        |
| `email`         | String   | Adresse email (unique)                          | Oui    | `john.doe@example.com`        |
| `password`      | String   | Mot de passe haché de l'utilisateur             | Oui    | `hashed_password`             |
| `numeroCompte`  | String   | Numéro de compte (unique)                       | Oui    | `ACC123456`                   |
| `telephone`     | String   | Numéro de téléphone                             | Oui    | `+221771234567`               |
| `role`          | String   | Rôle de l'utilisateur (client, agent, distributeur) | Oui    | `agent`                       |
| `photo`         | String   | URL ou chemin vers la photo de profil           | Non    | `https://example.com/photo.jpg` |
| `isActive`      | Boolean  | Statut d'activité du compte                     | Oui    | `true`                        |
| `createdAt`     | Date     | Date de création du compte                      | Oui    | `ISODate('...')`              |
| `updatedAt`     | Date     | Date de dernière mise à jour du compte          | Oui    | `ISODate('...')`              |

### 2.2. Collection `transactions`

Cette collection enregistrera toutes les transactions effectuées.

| Champ           | Type     | Description                                     | Requis | Exemple                       |
| :-------------- | :------- | :---------------------------------------------- | :----- | :---------------------------- |
| `_id`           | ObjectId | Identifiant unique de la transaction            | Oui    | `ObjectId('...')`             |
| `agentId`       | ObjectId | Référence à l'agent initiateur de la transaction | Oui    | `ObjectId('...')`             |
| `distributorId` | ObjectId | Référence au distributeur cible                 | Oui    | `ObjectId('...')`             |
| `montant`       | Number   | Montant de la transaction                       | Oui    | `500`                         |
| `devise`        | String   | Devise de la transaction                        | Oui    | `F`                           |
| `type`          | String   | Type de transaction (dépôt, annulation)         | Oui    | `depot`                       |
| `statut`        | String   | Statut de la transaction (en attente, complété, annulé, bloqué) | Oui    | `complété`                    |
| `numeroTransaction` | String | Numéro unique de la transaction                 | Oui    | `TRX987654`                   |
| `createdAt`     | Date     | Date et heure de la transaction                 | Oui    | `ISODate('...')`              |
| `updatedAt`     | Date     | Date de dernière mise à jour du statut          | Oui    | `ISODate('...')`              |

## 3. Instructions de Configuration Locale pour MongoDB

Étant donné que MongoDB est déjà installé localement, voici les étapes pour créer la base de données et les collections.

### Étape 1: Démarrer le serveur MongoDB

Assurez-vous que votre serveur MongoDB est en cours d'exécution. Si ce n'est pas le cas, vous pouvez le démarrer via votre service manager ou en ligne de commande (cela dépend de votre installation).

```bash
sudo systemctl start mongod # Pour les systèmes basés sur systemd (Ubuntu, Debian)
# ou
brew services start mongodb-community # Pour macOS avec Homebrew
# ou simplement
mongod # Si vous l'exécutez manuellement
```

### Étape 2: Accéder au Shell MongoDB

Ouvrez un terminal et connectez-vous au shell MongoDB en tapant `mongosh` ou `mongo` (selon votre version de MongoDB).

```bash
mongosh
```

### Étape 3: Créer la Base de Données et les Collections

Une fois dans le shell `mongosh`, exécutez les commandes suivantes pour créer la base de données `agent_dashboard_db` et les collections `users` et `transactions`. MongoDB crée automatiquement la base de données et les collections lors de la première insertion de données si elles n'existent pas. Cependant, vous pouvez les créer explicitement.

```javascript
// Utiliser la base de données. Si elle n'existe pas, elle sera créée.
use agent_dashboard_db;

// Créer la collection 'users' (optionnel, car elle est créée à la première insertion)
db.createCollection('users');

// Créer la collection 'transactions' (optionnel, car elle est créée à la première insertion)
db.createCollection('transactions');

// Créer des index pour optimiser les recherches fréquentes
// Index pour la recherche d'utilisateurs
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ numeroCompte: 1 }, { unique: true });
db.users.createIndex({ telephone: 1 });
db.users.createIndex({ nom: 1, prenom: 1 });

// Index pour la recherche de transactions
db.transactions.createIndex({ numeroTransaction: 1 }, { unique: true });
db.transactions.createIndex({ agentId: 1 });
db.transactions.createIndex({ distributorId: 1 });
db.transactions.createIndex({ createdAt: -1 }); // Pour l'historique

// Exemple d'insertion de données (pour tester)
// Insertion d'un agent
db.users.insertOne({
    nom: 'Agent',
    prenom: 'Principal',
    email: 'agent@example.com',
    password: 'hashed_password_agent',
    numeroCompte: 'AGT001',
    telephone: '+221771112233',
    role: 'agent',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
});

// Insertion d'un client
db.users.insertOne({
    nom: 'Client',
    prenom: 'Fidèle',
    email: 'client@example.com',
    password: 'hashed_password_client',
    numeroCompte: 'CLI001',
    telephone: '+221774445566',
    role: 'client',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
});

// Insertion d'un distributeur
db.users.insertOne({
    nom: 'Distributeur',
    prenom: 'Local',
    email: 'distrib@example.com',
    password: 'hashed_password_distrib',
    numeroCompte: 'DIS001',
    telephone: '+221777778899',
    role: 'distributeur',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
});

// Insertion d'une transaction exemple
db.transactions.insertOne({
    agentId: db.users.findOne({ numeroCompte: 'AGT001' })._id,
    distributorId: db.users.findOne({ numeroCompte: 'DIS001' })._id,
    montant: 1000,
    devise: 'F',
    type: 'depot',
    statut: 'complété',
    numeroTransaction: 'TRX000001',
    createdAt: new Date(),
    updatedAt: new Date()
});

// Vérifier les collections créées
show collections;
```

### Étape 4: Quitter le Shell MongoDB

Pour quitter le shell, tapez `exit`.

```bash
exit
```

Ces étapes vous permettront d'avoir une base de données MongoDB `agent_dashboard_db` avec les collections `users` et `transactions` prêtes pour le développement de l'API Node.js.
