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

// Configuration CORS pour autoriser Vercel
const corsOptions = {
  origin: [
    'https://tableau-de-bord-agentok.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};
app.use(cors(corsOptions));
// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.error("Erreur de connexion à MongoDB:", err));

app.get("/", (req, res) => {
  res.send("API Agent Dashboard");
});

// Définir les routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/transactions', require('./routes/transactions'));

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

