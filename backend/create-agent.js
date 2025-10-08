// Script pour créer un agent de test dans MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modèle User simplifié
const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: { type: String, unique: true },
  password: String,
  numeroCompte: { type: String, unique: true },
  telephone: String,
  role: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAgent() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier si l'agent existe déjà
    const existingAgent = await User.findOne({ email: 'agent@example.com' });
    if (existingAgent) {
      console.log('✅ L\'agent existe déjà !');
      console.log('');
      console.log('📧 Email : agent@example.com');
      console.log('🔑 Mot de passe : test123');
      console.log('');
      process.exit(0);
    }

    // Créer le mot de passe haché
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);

    // Créer l'agent
    const agent = new User({
      nom: 'Agent',
      prenom: 'Principal',
      email: 'agent@example.com',
      password: hashedPassword,
      numeroCompte: 'AGT001',
      telephone: '+221771234567',
      role: 'agent',
      isActive: true
    });

    await agent.save();
    console.log('✅ Agent créé avec succès !');
    console.log('');
    console.log('═══════════════════════════════════');
    console.log('  📋 IDENTIFIANTS DE CONNEXION');
    console.log('═══════════════════════════════════');
    console.log('📧 Email : agent@example.com');
    console.log('🔑 Mot de passe : test123');
    console.log('👤 Rôle : Agent');
    console.log('💳 Compte : AGT001');
    console.log('═══════════════════════════════════');
    console.log('');
    console.log('🚀 Vous pouvez maintenant vous connecter !');
    console.log('👉 http://localhost:5173');
    console.log('');

    // Créer aussi quelques utilisateurs de test
    console.log('📝 Création d\'utilisateurs de test...');

    // Client
    const clientPassword = await bcrypt.hash('client123', salt);
    const client = new User({
      nom: 'Diallo',
      prenom: 'Amadou',
      email: 'client@example.com',
      password: clientPassword,
      numeroCompte: 'CLI001234',
      telephone: '+221774567890',
      role: 'client',
      isActive: true
    });
    await client.save();
    console.log('✅ Client créé : client@example.com / client123');

    // Distributeur
    const distPassword = await bcrypt.hash('dist123', salt);
    const distributeur = new User({
      nom: 'Sarr',
      prenom: 'Moussa',
      email: 'distributeur@example.com',
      password: distPassword,
      numeroCompte: 'DIS001234',
      telephone: '+221779876543',
      role: 'distributeur',
      isActive: true
    });
    await distributeur.save();
    console.log('✅ Distributeur créé : distributeur@example.com / dist123');

    console.log('');
    console.log('🎉 Base de données initialisée avec succès !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

createAgent();
