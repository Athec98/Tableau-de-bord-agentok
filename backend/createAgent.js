require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAgent() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connecté à MongoDB");

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ $or: [{ email: "agent@test.com" }, { numeroCompte: "AGT001" }] });
    if (user) {
      console.log("Un utilisateur existe déjà !");
      console.log("Email:", user.email);
      console.log("Numéro de compte:", user.numeroCompte);
      console.log("Rôle:", user.role);
      console.log("\nSi vous ne connaissez pas le mot de passe, supprimez cet utilisateur et relancez le script.");
      process.exit(0);
    }

    // Créer un nouvel agent
    user = new User({
      nom: "Admin",
      prenom: "Agent",
      email: "agent@test.com",
      password: "test123",
      numeroCompte: "AGT001",
      telephone: "+221771234567",
      role: "agent"
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash("test123", salt);

    await user.save();
    console.log("✅ Agent créé avec succès !");
    console.log("Email: agent@test.com");
    console.log("Mot de passe: test123");
    console.log("Numéro de compte: AGT001");
    
    process.exit(0);
  } catch (err) {
    console.error("Erreur:", err.message);
    process.exit(1);
  }
}

createAgent();
