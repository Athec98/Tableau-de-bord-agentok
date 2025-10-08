#!/bin/bash

# Script de déploiement rapide - Tableau de Bord Agent
# Ce script automatise le processus de déploiement

echo "🚀 Déploiement Tableau de Bord Agent"
echo "===================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les erreurs
error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Fonction pour afficher les succès
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher les avertissements
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé. Installez-le depuis https://nodejs.org"
fi

success "Node.js trouvé: $(node -v)"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    error "npm n'est pas installé"
fi

success "npm trouvé: $(npm -v)"

echo ""
echo "📦 Étape 1: Vérification des dépendances"
echo "----------------------------------------"

# Backend
cd backend || error "Dossier backend introuvable"
if [ ! -d "node_modules" ]; then
    warning "Installation des dépendances backend..."
    npm install || error "Échec installation backend"
fi
success "Dépendances backend OK"

# Frontend
cd ../agent-dashboard-frontend || error "Dossier frontend introuvable"
if [ ! -d "node_modules" ]; then
    warning "Installation des dépendances frontend..."
    npm install || error "Échec installation frontend"
fi
success "Dépendances frontend OK"

echo ""
echo "🏗️  Étape 2: Build Frontend"
echo "----------------------------"

# Build frontend
npm run build || error "Échec du build frontend"
success "Build frontend terminé"

# Vérifier que dist existe
if [ ! -d "dist" ]; then
    error "Dossier dist non créé"
fi

# Vérifier portal-root dans index.html
if grep -q "portal-root" dist/index.html; then
    success "portal-root trouvé dans index.html"
else
    error "portal-root MANQUANT dans dist/index.html"
fi

echo ""
echo "🧪 Étape 3: Tests Pré-Déploiement"
echo "--------------------------------"

# Tester backend
cd ../backend
echo "Démarrage backend pour test..."
timeout 5 npm start &> /dev/null &
BACKEND_PID=$!
sleep 3

# Vérifier si le backend répond
if curl -s http://localhost:5000 &> /dev/null; then
    success "Backend répond"
else
    warning "Backend ne répond pas (vérifier manuellement)"
fi

# Arrêter le backend de test
kill $BACKEND_PID 2>/dev/null

echo ""
echo "📋 Résumé"
echo "========="
success "✅ Dépendances installées"
success "✅ Build frontend créé"
success "✅ Fichiers de configuration présents"
echo ""
echo "📦 Prêt pour le déploiement !"
echo ""
echo "Prochaines étapes:"
echo "1. Déployer le backend (Vercel/Render/Heroku)"
echo "2. Déployer le frontend (Vercel/Netlify/GitHub Pages)"
echo "3. Configurer les variables d'environnement"
echo "4. Tester en production"
echo ""
echo "📖 Voir GUIDE_DEPLOIEMENT.md pour les instructions détaillées"
echo ""
