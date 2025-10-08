# Documentation du Tableau de Bord Agent

Ce document fournit les instructions nécessaires pour configurer, lancer et utiliser l'application de tableau de bord pour agent. L'application est composée d'un backend en Node.js avec une base de données MongoDB, et d'un frontend en React.

## 1. Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

*   **Node.js** (version 20 ou supérieure)
*   **npm** ou **pnpm** (pnpm est recommandé)
*   **MongoDB** (déjà installé localement selon votre demande)

## 2. Configuration de la Base de Données MongoDB

La base de données MongoDB doit être configurée comme suit. Un fichier `mongodb_setup.md` est également fourni avec des détails supplémentaires.

1.  **Démarrez votre service MongoDB** localement.

    ```bash
    sudo systemctl start mongod
    ```

2.  **Accédez au shell MongoDB** (`mongosh`).

    ```bash
    mongosh
    ```

3.  **Créez la base de données et les collections** en exécutant le script JavaScript suivant dans le shell `mongosh`. Ce script crée la base de données `agent_dashboard_db`, les collections `users` et `transactions`, et insère des données de test.

    ```javascript
    use agent_dashboard_db;

    db.createCollection("users");
    db.createCollection("transactions");

    db.users.createIndex({ email: 1 }, { unique: true });
    db.users.createIndex({ numeroCompte: 1 }, { unique: true });

    // ... (le reste du script se trouve dans `mongodb_setup.md`)
    ```

## 3. Configuration et Lancement du Backend (Node.js)

Le backend gère la logique métier, l'authentification et la communication avec la base de données.

1.  **Accédez au répertoire du backend**.

    ```bash
    cd backend
    ```

2.  **Installez les dépendances**.

    ```bash
    npm install
    # ou si vous utilisez pnpm
    pnpm install
    ```

3.  **Configurez les variables d'environnement**. Le fichier `.env` est déjà préconfiguré pour une utilisation locale.

    ```dotenv
    MONGO_URI=mongodb://localhost:27017/agent_dashboard_db
    PORT=5000
    JWT_SECRET=supersecretjwtkey
    ```

4.  **Lancez le serveur backend**.

    ```bash
    node server.js
    ```

    Le serveur devrait démarrer sur `http://localhost:5000`.

## 4. Configuration et Lancement du Frontend (React)

Le frontend est une application React qui fournit l'interface utilisateur du tableau de bord.

1.  **Accédez au répertoire du frontend**.

    ```bash
    cd agent-dashboard-frontend
    ```

2.  **Installez les dépendances**.

    ```bash
    pnpm install
    ```

3.  **Lancez le serveur de développement**.

    ```bash
    pnpm run dev
    ```

    L'application sera accessible à l'adresse `http://localhost:5173` (ou un port similaire).

## 5. Utilisation de l'Application

*   **Page de Connexion**: Utilisez les identifiants de test fournis sur la page de connexion pour accéder au tableau de bord.
*   **Navigation**: Utilisez la barre latérale pour naviguer entre les différentes sections (Dashboard, Utilisateurs, Dépôt, etc.).
*   **Fonctionnalités**: Explorez les fonctionnalités de recherche en temps réel, de pagination, de tri, de mode sombre/clair et de gestion des utilisateurs et des transactions.

Ce projet a été entièrement généré par Manus, votre agent IA. Tous les fichiers nécessaires sont inclus dans l'archive.
