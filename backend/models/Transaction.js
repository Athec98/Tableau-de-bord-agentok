const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  distributorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  montant: {
    type: Number,
    required: true,
    min: 500, // Montant minimum de dépôt
  },
  devise: {
    type: String,
    default: "F",
  },
  type: {
    type: String,
    enum: ["depot", "annulation"],
    required: true,
  },
  statut: {
    type: String,
    enum: ["en attente", "complété", "annulé", "bloqué"],
    default: "en attente",
  },
  numeroTransaction: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);

