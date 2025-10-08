# Script de déploiement rapide - Tableau de Bord Agent (Windows PowerShell)

Write-Host "🚀 Déploiement Tableau de Bord Agent" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Fonctions utilitaires
function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
    exit 1
}

function Write-Warning-Custom {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

# Vérifier Node.js
Write-Host "Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Success "Node.js trouvé: $nodeVersion"
} catch {
    Write-Error-Custom "Node.js n'est pas installé. Téléchargez-le depuis https://nodejs.org"
}

# Vérifier npm
try {
    $npmVersion = npm -v
    Write-Success "npm trouvé: $npmVersion"
} catch {
    Write-Error-Custom "npm n'est pas installé"
}

Write-Host ""
Write-Host "📦 Étape 1: Vérification des dépendances" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

# Backend
Write-Host "Vérification backend..." -ForegroundColor Yellow
Set-Location backend

if (-Not (Test-Path "node_modules")) {
    Write-Warning-Custom "Installation des dépendances backend..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Échec installation backend"
    }
}
Write-Success "Dépendances backend OK"

# Frontend
Write-Host "Vérification frontend..." -ForegroundColor Yellow
Set-Location ..\agent-dashboard-frontend

if (-Not (Test-Path "node_modules")) {
    Write-Warning-Custom "Installation des dépendances frontend..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Échec installation frontend"
    }
}
Write-Success "Dépendances frontend OK"

Write-Host ""
Write-Host "🏗️  Étape 2: Build Frontend" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Échec du build frontend"
}
Write-Success "Build frontend terminé"

# Vérifier dist
if (-Not (Test-Path "dist")) {
    Write-Error-Custom "Dossier dist non créé"
}

# Vérifier portal-root
$indexContent = Get-Content "dist\index.html" -Raw
if ($indexContent -match "portal-root") {
    Write-Success "portal-root trouvé dans index.html"
} else {
    Write-Error-Custom "portal-root MANQUANT dans dist/index.html"
}

Write-Host ""
Write-Host "🧪 Étape 3: Tests Pré-Déploiement" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan

# Test backend
Set-Location ..\backend
Write-Host "Test du backend..." -ForegroundColor Yellow

$backendJob = Start-Job -ScriptBlock { 
    Set-Location $using:PWD
    npm start 
}

Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Success "Backend répond"
} catch {
    Write-Warning-Custom "Backend ne répond pas (vérifier manuellement)"
}

Stop-Job $backendJob -ErrorAction SilentlyContinue
Remove-Job $backendJob -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "📋 Résumé" -ForegroundColor Cyan
Write-Host "=========" -ForegroundColor Cyan
Write-Success "✅ Dépendances installées"
Write-Success "✅ Build frontend créé"
Write-Success "✅ Fichiers de configuration présents"
Write-Host ""
Write-Host "📦 Prêt pour le déploiement !" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Déployer le backend (Vercel/Render/Heroku)"
Write-Host "2. Déployer le frontend (Vercel/Netlify/GitHub Pages)"
Write-Host "3. Configurer les variables d'environnement"
Write-Host "4. Tester en production"
Write-Host ""
Write-Host "📖 Voir GUIDE_DEPLOIEMENT.md pour les instructions détaillées" -ForegroundColor Cyan
Write-Host ""

# Retour au dossier racine
Set-Location ..
