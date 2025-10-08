import axios from 'axios';

// Configuration de l'URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('token');
      // Éviter la redirection si on est déjà sur la page de login
      if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
        // Utiliser setTimeout pour éviter les problèmes de timing
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

// ============ API d'authentification ============
export const authAPI = {
  // Connexion
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Inscription
  register: (userData) => api.post('/auth/register', userData),
  
  // Récupérer le profil de l'utilisateur connecté
  getProfile: () => api.get('/auth/profile'),
};

// ============ API des utilisateurs ============
export const usersAPI = {
  // Récupérer tous les utilisateurs
  getAll: (params) => api.get('/users', { params }),
  
  // Récupérer un utilisateur par ID
  getById: (id) => api.get(`/users/${id}`),
  
  // Créer un utilisateur
  create: (userData) => api.post('/users', userData),
  
  // Mettre à jour un utilisateur
  update: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Supprimer un utilisateur
  delete: (id) => api.delete(`/users/${id}`),
  
  // Bloquer/débloquer un utilisateur (backend: PUT /users/toggle-status/:id)
  toggleStatus: (id) => api.put(`/users/toggle-status/${id}`),
  
  // Rechercher des utilisateurs
  search: (query) => api.get('/users/search', { params: { q: query } }),
};

// ============ API des transactions ============
export const transactionsAPI = {
  // Récupérer toutes les transactions
  getAll: (params) => api.get('/transactions', { params }),
  
  // Récupérer une transaction par ID
  getById: (id) => api.get(`/transactions/${id}`),
  
  // Créer une transaction (dépôt)
  createDeposit: (transactionData) => api.post('/transactions/deposit', transactionData),
  
  // Créer une transaction (retrait)
  createWithdrawal: (transactionData) => api.post('/transactions/withdrawal', transactionData),
  
  // Annuler une transaction
  cancel: (id, reason) => api.put(`/transactions/cancel/${id}`, { reason }),
  
  // Bloquer une transaction
  block: (id) => api.put(`/transactions/block/${id}`),
  
  // Supprimer une transaction
  delete: (id) => api.delete(`/transactions/${id}`),
  
  // Obtenir l'historique des transactions
  getHistory: (params) => api.get('/transactions/history', { params }),
  
  // Obtenir les statistiques des transactions
  getStats: (params) => api.get('/transactions/stats', { params }),
};

export default api;
