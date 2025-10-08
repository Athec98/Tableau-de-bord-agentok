const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Ajouter un nouvel utilisateur
exports.addUser = async (req, res) => {
  const { nom, prenom, email, password, numeroCompte, telephone, role, photo } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { numeroCompte }] });
    if (user) {
      return res.status(400).json({ msg: "Un utilisateur avec cet email ou numéro de compte existe déjà" });
    }

    user = new User({
      nom,
      prenom,
      email,
      password,
      numeroCompte,
      telephone,
      role,
      photo,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ msg: "Utilisateur ajouté avec succès" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  const { nom, prenom, email, numeroCompte, telephone, role, photo, isActive } = req.body;

  const userFields = {};
  if (nom) userFields.nom = nom;
  if (prenom) userFields.prenom = prenom;
  if (email) userFields.email = email;
  if (numeroCompte) userFields.numeroCompte = numeroCompte;
  if (telephone) userFields.telephone = telephone;
  if (role) userFields.role = role;
  if (photo) userFields.photo = photo;
  if (typeof isActive === "boolean") userFields.isActive = isActive;
  userFields.updatedAt = Date.now();

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "Utilisateur supprimé" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Bloquer/Débloquer un utilisateur
exports.toggleUserStatus = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    user.isActive = !user.isActive;
    user.updatedAt = Date.now();
    await user.save();

    res.json({ msg: `Utilisateur ${user.isActive ? "débloqué" : "bloqué"} avec succès`, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Rechercher des utilisateurs
exports.searchUsers = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({
      $or: [
        { nom: { $regex: query, $options: "i" } },
        { prenom: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { numeroCompte: { $regex: query, $options: "i" } },
        { telephone: { $regex: query, $options: "i" } },
      ],
    }).select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Supprimer plusieurs utilisateurs
exports.deleteMultipleUsers = async (req, res) => {
  const { userIds } = req.body;
  try {
    await User.deleteMany({ _id: { $in: userIds } });
    res.json({ msg: "Utilisateurs sélectionnés supprimés avec succès" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

