require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connecté à MongoDB");

    // Trouver l'utilisateur
    let user = await User.findOne({ email: "agent@example.com" });
    if (!user) {
      console.log("Utilisateur non trouvé !");
      process.exit(1);
    }

    // Réinitialiser le mot de passe
    const newPassword = "test123";
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    console.log("✅ Mot de passe réinitialisé avec succès !");
    console.log("Email:", user.email);
    console.log("Nouveau mot de passe: test123");
    console.log("Numéro de compte:", user.numeroCompte);
    
    process.exit(0);
  } catch (err) {
    console.error("Erreur:", err.message);
    process.exit(1);
  }
}

resetPassword();
