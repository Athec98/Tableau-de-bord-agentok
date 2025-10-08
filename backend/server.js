require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const transactionsRoutes = require("./routes/transactions"); // Importation de transactionsRoutes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Activer CORS pour toutes les requêtes
// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.error("Erreur de connexion à MongoDB:", err));

// Définir les routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/transactions', require('./routes/transactions'));

// Route temporaire pour peupler la base de donnees (A SUPPRIMER EN PRODUCTION APRES UTILISATION)
app.get('/api/seed', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    
    // Verifier si des utilisateurs existent deja
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.json({ msg: 'Base de donnees deja peuplee', count: existingUsers });
    }
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Creer un agent de test
    await User.create({
      nom: 'Admin',
      prenom: 'Agent',
      email: 'agent1@example.com',
      password: hashedPassword,
      numeroCompte: 'AGT001234',
      telephone: '+221 77 123 45 67',
      role: 'agent',
      isActive: true
    });
    
    // Creer quelques distributeurs
    const distributeurs = [
      { nom: 'Diallo', prenom: 'Mamadou', email: 'distributeur1@example.com', compte: 'DIS001234' },
      { nom: 'Ndiaye', prenom: 'Fatou', email: 'distributeur2@example.com', compte: 'DIS001235' },
      { nom: 'Sow', prenom: 'Ousmane', email: 'distributeur3@example.com', compte: 'DIS001236' }
    ];
    
    for (const dist of distributeurs) {
      await User.create({
        nom: dist.nom,
        prenom: dist.prenom,
        email: dist.email,
        password: hashedPassword,
        numeroCompte: dist.compte,
        telephone: '+221 77 ' + Math.floor(Math.random() * 900 + 100) + ' ' + Math.floor(Math.random() * 9000 + 1000),
        role: 'distributeur',
        isActive: true
      });
    }
    
    const totalUsers = await User.countDocuments();
    res.json({ 
      msg: 'Base de donnees peuplee avec succes !', 
      users: totalUsers,
      login: { email: 'agent1@example.com', password: 'password123' }
    });
    
  } catch (error) {
    console.error('Erreur seed:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("API Agent Dashboard");
});
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

