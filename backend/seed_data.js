require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✓ Connecté à MongoDB'))
  .catch(err => {
    console.error('✗ Erreur de connexion:', err);
    process.exit(1);
  });

// Fonction pour générer un numéro de compte aléatoire
function generateAccountNumber() {
  return 'ACC' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
}

// Fonction pour générer un numéro de transaction
function generateTransactionNumber() {
  return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
}

// Fonction pour générer un numéro de téléphone
function generatePhone() {
  return '+221 77 ' + Math.floor(Math.random() * 900 + 100) + ' ' + Math.floor(Math.random() * 9000 + 1000);
}

async function seedDatabase() {
  try {
    console.log('\n=== Nettoyage de la base de données ===');
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('✓ Base de données nettoyée\n');

    // Hash du mot de passe par défaut
    const hashedPassword = await bcrypt.hash('password123', 10);

    console.log('=== Création des utilisateurs ===');

    // Créer des distributeurs
    const distributeurs = [];
    const nomsDistributeurs = ['Diallo', 'Ndiaye', 'Sow', 'Ba', 'Fall'];
    const prenomsDistributeurs = ['Mamadou', 'Fatou', 'Ousmane', 'Aissatou', 'Ibrahima'];

    for (let i = 0; i < 5; i++) {
      const distributeur = await User.create({
        nom: nomsDistributeurs[i],
        prenom: prenomsDistributeurs[i],
        email: `distributeur${i + 1}@example.com`,
        password: hashedPassword,
        numeroCompte: generateAccountNumber(),
        telephone: generatePhone(),
        role: 'distributeur',
        isActive: true
      });
      distributeurs.push(distributeur);
      console.log(`✓ Distributeur créé: ${distributeur.prenom} ${distributeur.nom}`);
    }

    // Créer des agents
    const agents = [];
    const nomsAgents = ['Sarr', 'Gueye', 'Diouf', 'Thiam', 'Cisse', 'Sy', 'Mbaye', 'Faye'];
    const prenomsAgents = ['Moussa', 'Aminata', 'Cheikh', 'Mariama', 'Abdou', 'Khady', 'Modou', 'Binta'];

    for (let i = 0; i < 8; i++) {
      const agent = await User.create({
        nom: nomsAgents[i],
        prenom: prenomsAgents[i],
        email: `agent${i + 1}@example.com`,
        password: hashedPassword,
        numeroCompte: generateAccountNumber(),
        telephone: generatePhone(),
        role: 'agent',
        isActive: i < 6 // 6 agents actifs, 2 inactifs
      });
      agents.push(agent);
      console.log(`✓ Agent créé: ${agent.prenom} ${agent.nom} (${agent.isActive ? 'Actif' : 'Inactif'})`);
    }

    // Créer des clients
    const clients = [];
    const nomsClients = ['Diop', 'Kane', 'Seck', 'Toure', 'Camara'];
    const prenomsClients = ['Alioune', 'Ndeye', 'Seydou', 'Awa', 'Lamine'];

    for (let i = 0; i < 5; i++) {
      const client = await User.create({
        nom: nomsClients[i],
        prenom: prenomsClients[i],
        email: `client${i + 1}@example.com`,
        password: hashedPassword,
        numeroCompte: generateAccountNumber(),
        telephone: generatePhone(),
        role: 'client',
        isActive: true
      });
      clients.push(client);
      console.log(`✓ Client créé: ${client.prenom} ${client.nom}`);
    }

    console.log('\n=== Création des transactions ===');

    // Créer des transactions
    const statuts = ['en attente', 'complété', 'annulé'];
    const types = ['depot', 'annulation'];
    const montants = [1000, 2500, 5000, 10000, 15000, 25000, 50000, 100000];

    let transactionCount = 0;

    // Créer 30 transactions sur les 30 derniers jours
    for (let i = 0; i < 30; i++) {
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const distributeur = distributeurs[Math.floor(Math.random() * distributeurs.length)];
      const montant = montants[Math.floor(Math.random() * montants.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const statut = statuts[Math.floor(Math.random() * statuts.length)];
      
      // Date aléatoire dans les 30 derniers jours
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      const transaction = await Transaction.create({
        agentId: agent._id,
        distributorId: distributeur._id,
        montant: montant,
        devise: 'F',
        type: type,
        statut: statut,
        numeroTransaction: generateTransactionNumber(),
        createdAt: date,
        updatedAt: date
      });
      
      transactionCount++;
      if (transactionCount % 10 === 0) {
        console.log(`✓ ${transactionCount} transactions créées...`);
      }
    }

    console.log(`✓ Total: ${transactionCount} transactions créées\n`);

    // Afficher les statistiques
    console.log('=== Statistiques ===');
    const totalUsers = await User.countDocuments();
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const totalDistributeurs = await User.countDocuments({ role: 'distributeur' });
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalTransactions = await Transaction.countDocuments();
    const transactionsCompletes = await Transaction.countDocuments({ statut: 'complété' });
    const transactionsEnAttente = await Transaction.countDocuments({ statut: 'en attente' });

    console.log(`Total utilisateurs: ${totalUsers}`);
    console.log(`  - Agents: ${totalAgents}`);
    console.log(`  - Distributeurs: ${totalDistributeurs}`);
    console.log(`  - Clients: ${totalClients}`);
    console.log(`Total transactions: ${totalTransactions}`);
    console.log(`  - Complétées: ${transactionsCompletes}`);
    console.log(`  - En attente: ${transactionsEnAttente}`);

    console.log('\n=== Informations de connexion ===');
    console.log('Email: agent1@example.com');
    console.log('Mot de passe: password123');
    console.log('\n✓ Base de données peuplée avec succès!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('✗ Erreur:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Exécuter le script
seedDatabase();
