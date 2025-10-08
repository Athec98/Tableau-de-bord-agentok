const Transaction = require("../models/Transaction");
const User = require("../models/User");

// Effectuer un dépôt
exports.createDeposit = async (req, res) => {
  const { destinataireId, distributorId, montant } = req.body;

  try {
    // L'agent est l'utilisateur connecté
    const agentId = req.user.id;
    const agent = await User.findById(agentId);

    if (!agent || agent.role !== "agent") {
      return res.status(403).json({ msg: "Agent non trouvé ou rôle incorrect" });
    }

    // Utiliser destinataireId ou distributorId comme distributeur
    const distributorIdToUse = destinataireId || distributorId;
    
    if (!distributorIdToUse) {
      return res.status(400).json({ msg: "Distributeur requis" });
    }

    const distributor = await User.findById(distributorIdToUse);
    if (!distributor || distributor.role !== "distributeur") {
      return res.status(404).json({ msg: "Distributeur non trouvé ou rôle incorrect" });
    }

    // Vérifier le montant minimum
    if (montant < 500) {
      return res.status(400).json({ msg: "Le montant minimum de dépôt est de 500 F" });
    }

    const newTransaction = new Transaction({
      agentId,
      distributorId: distributorIdToUse,
      montant,
      type: "depot",
      statut: "complété", // Un dépôt est complété par défaut
      numeroTransaction: `TRX${Date.now()}`,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Obtenir toutes les transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("agentId", "nom prenom email numeroCompte telephone")
      .populate("distributorId", "nom prenom email numeroCompte telephone")
      .sort({ createdAt: -1 });

    // Reformater les données pour le frontend
    const formattedTransactions = transactions.map(t => {
      console.log('Agent:', t.agentId);
      console.log('Distributeur:', t.distributorId);
      
      return {
        _id: t._id,
        numeroTransaction: t.numeroTransaction,
        agentId: t.agentId?._id,
        agentNom: t.agentId ? `${t.agentId.prenom} ${t.agentId.nom}` : 'N/A',
        agentCompte: t.agentId?.numeroCompte || 'N/A',
        agentTelephone: t.agentId?.telephone || 'N/A',
        distributorId: t.distributorId?._id,
        distributeurNom: t.distributorId ? `${t.distributorId.prenom} ${t.distributorId.nom}` : 'N/A',
        distributeurCompte: t.distributorId?.numeroCompte || 'N/A',
        distributeurTelephone: t.distributorId?.telephone || 'N/A',
        montant: t.montant,
        devise: t.devise || 'F',
        type: t.type,
        statut: t.statut,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      };
    });

    console.log('Formatted transaction example:', formattedTransactions[0]);
    res.json(formattedTransactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Rechercher des transactions
exports.searchTransactions = async (req, res) => {
  const { query } = req.query;
  try {
    const transactions = await Transaction.find({
      $or: [
        { numeroTransaction: { $regex: query, $options: "i" } },
        { "agentId.numeroCompte": { $regex: query, $options: "i" } },
        { "distributorId.numeroCompte": { $regex: query, $options: "i" } },
        { "agentId.telephone": { $regex: query, $options: "i" } },
        { "distributorId.telephone": { $regex: query, $options: "i" } },
      ],
    })
      .populate("agentId", "nom prenom email numeroCompte telephone")
      .populate("distributorId", "nom prenom email numeroCompte telephone");
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Annuler une transaction
exports.cancelTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction non trouvée" });
    }

    if (transaction.statut === "complété") {
      transaction.statut = "annulé";
      transaction.updatedAt = Date.now();
      await transaction.save();
      res.json({ msg: "Transaction annulée avec succès", transaction });
    } else {
      res.status(400).json({ msg: "Impossible d'annuler une transaction qui n'est pas complétée" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Bloquer une transaction
exports.blockTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction non trouvée" });
    }

    if (transaction.statut !== "bloqué") {
      transaction.statut = "bloqué";
      transaction.updatedAt = Date.now();
      await transaction.save();
      res.json({ msg: "Transaction bloquée avec succès", transaction });
    } else {
      res.status(400).json({ msg: "La transaction est déjà bloquée" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Supprimer une transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction non trouvée" });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ msg: "Transaction supprimée avec succès" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Obtenir l'historique des transactions (toutes les transactions)
exports.getTransactionsHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("agentId", "nom prenom email numeroCompte telephone")
      .populate("distributorId", "nom prenom email numeroCompte telephone")
      .sort({ createdAt: -1 }); // Trier par date de création décroissante

    // Reformater les données pour le frontend
    const formattedTransactions = transactions.map(t => ({
      id: t._id,
      _id: t._id,
      numeroTransaction: t.numeroTransaction,
      agentId: t.agentId?._id,
      agentNom: t.agentId ? `${t.agentId.prenom} ${t.agentId.nom}` : 'N/A',
      agentCompte: t.agentId?.numeroCompte || 'N/A',
      agentTelephone: t.agentId?.telephone || 'N/A',
      distributorId: t.distributorId?._id,
      distributeurNom: t.distributorId ? `${t.distributorId.prenom} ${t.distributorId.nom}` : 'N/A',
      distributeurCompte: t.distributorId?.numeroCompte || 'N/A',
      distributeurTelephone: t.distributorId?.telephone || 'N/A',
      montant: t.montant,
      devise: t.devise || 'F',
      type: t.type,
      statut: t.statut,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));

    res.json(formattedTransactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

