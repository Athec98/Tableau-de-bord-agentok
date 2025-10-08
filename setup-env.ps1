# Script de configuration des fichiers d'environnement
Write-Host "🔧 Configuration des fichiers d'environnement..." -ForegroundColor Green

# Créer le fichier .env pour le backend
$backendEnv = @"
# Configuration de la base de données MongoDB
MONGO_URI=mongodb://localhost:27017/agent-dashboard

# Configuration du serveur
PORT=5000
NODE_ENV=development

# Configuration JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Configuration CORS
CORS_ORIGIN=http://localhost:5173
"@

$backendEnv | Out-File -FilePath "backend\.env" -Encoding UTF8
Write-Host "✅ Fichier .env créé pour le backend" -ForegroundColor Green

# Créer le fichier .env pour le frontend
$frontendEnv = @"
# Configuration de l'API Backend
VITE_API_URL=http://localhost:5000/api

# Configuration de l'environnement
NODE_ENV=development
"@

$frontendEnv | Out-File -FilePath "agent-dashboard-frontend\.env" -Encoding UTF8
Write-Host "✅ Fichier .env créé pour le frontend" -ForegroundColor Green

Write-Host "🎉 Configuration terminée!" -ForegroundColor Green
Write-Host "Vous pouvez maintenant exécuter: .\start-dev.ps1" -ForegroundColor Cyan
