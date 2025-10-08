// Script pour peupler la base de donnees de PRODUCTION
// A executer LOCALEMENT pour creer les utilisateurs de test

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// IMPORTANT: URL MongoDB Atlas de PRODUCTION
const MONGO_URI = "mongodb+srv://agent_dashboard_db:Assane%401998@cluster1.rmreeqq.mongodb.net/agent-dashboard?retryWrites=true&w=majority&appName=Cluster1";

// Schema User (copie du modele)
const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  numeroCompte: { type: String, required: true, unique: true },
  telephone: { type: String, required: true },
  role: { type: String, enum: ['agent', 'client', 'distributeur'], required: true },
  photo: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function seedProduction() {
  try {
    console.log('Connexion a MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('OK - Connecte a MongoDB Atlas\n');

    // Verifier si des utilisateurs existent deja
    const count = await User.countDocuments();
    if (count > 0) {
      console.log(`ATTENTION: ${count} utilisateur(s) existent deja dans la base.`);
      console.log('Voulez-vous vraiment continuer ? (Ctrl+C pour annuler)');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('Creation des utilisateurs...\n');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Agent principal
    const agent = await User.create({
      nom: 'Admin',
      prenom: 'Agent',
      email: 'agent1@example.com',
      password: hashedPassword,
      numeroCompte: 'AGT001234',
      telephone: '+221 77 123 45 67',
      role: 'agent',
      isActive: true
    });
    console.log('OK - Agent cree:', agent.email);

    // Distributeurs
    const distributeurs = [
      { nom: 'Diallo', prenom: 'Mamadou', email: 'distributeur1@example.com', compte: 'DIS001234', tel: '+221 77 234 56 78' },
      { nom: 'Ndiaye', prenom: 'Fatou', email: 'distributeur2@example.com', compte: 'DIS001235', tel: '+221 77 345 67 89' },
      { nom: 'Sow', prenom: 'Ousmane', email: 'distributeur3@example.com', compte: 'DIS001236', tel: '+221 77 456 78 90' }
    ];

    for (const dist of distributeurs) {
      await User.create({
        nom: dist.nom,
        prenom: dist.prenom,
        email: dist.email,
        password: hashedPassword,
        numeroCompte: dist.compte,
        telephone: dist.tel,
        role: 'distributeur',
        isActive: true
      });
      console.log('OK - Distributeur cree:', dist.email);
    }

    const totalUsers = await User.countDocuments();
    console.log(`\n==================================`);
    console.log('SUCCES - Base de donnees peuplee !');
    console.log(`==================================`);
    console.log(`Total utilisateurs: ${totalUsers}`);
    console.log(`\nIdentifiants de connexion:`);
    console.log(`Email: agent1@example.com`);
    console.log(`Password: password123`);
    console.log(`\nVous pouvez maintenant vous connecter sur:`);
    console.log(`https://tableau-de-bord-agentok.vercel.app`);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('ERREUR:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedProduction();
