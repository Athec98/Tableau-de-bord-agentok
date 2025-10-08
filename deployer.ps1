# Script de deploiement - Tableau de Bord Agent
# Automatise la preparation du deploiement

Write-Host "Preparation du deploiement..." -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
Write-Host "📋 Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js trouvé: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé !" -ForegroundColor Red
    exit 1
}

# Vérifier npm
try {
    $npmVersion = npm -v
    Write-Host "✅ npm trouvé: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas installé !" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Étape 1: Vérification des dépendances" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

# Backend
Write-Host "Backend..." -ForegroundColor Yellow
Set-Location backend
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installation des dépendances backend..." -ForegroundColor Yellow
    npm install
}
Write-Host "✅ Backend OK" -ForegroundColor Green

# Frontend
Set-Location ..\agent-dashboard-frontend
Write-Host "Frontend..." -ForegroundColor Yellow
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installation des dépendances frontend..." -ForegroundColor Yellow
    npm install
}
Write-Host "✅ Frontend OK" -ForegroundColor Green

Write-Host ""
Write-Host "🏗️  Étape 2: Build Frontend" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

# Demander l'URL du backend
Write-Host ""
Write-Host "⚠️  URL du backend Render (exemple: https://tableau-agent-backend.onrender.com/api)" -ForegroundColor Yellow
$backendUrl = Read-Host "Entrez l'URL de votre backend Render (ou appuyez sur Entrée pour utiliser localhost)"

if ([string]::IsNullOrWhiteSpace($backendUrl)) {
    $backendUrl = "http://localhost:5000/api"
    Write-Host "ℹ️  Utilisation de l'URL locale: $backendUrl" -ForegroundColor Cyan
}

# Créer .env.production
Write-Host "Création de .env.production..." -ForegroundColor Yellow
"VITE_API_URL=$backendUrl" | Out-File -FilePath ".env.production" -Encoding UTF8
Write-Host "✅ .env.production créé" -ForegroundColor Green

# Build
Write-Host "Build du frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build !" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build terminé" -ForegroundColor Green

# Vérifier dist
if (-Not (Test-Path "dist")) {
    Write-Host "❌ Dossier dist non créé !" -ForegroundColor Red
    exit 1
}

# Vérifier portal-root
$indexContent = Get-Content "dist\index.html" -Raw
if ($indexContent -match "portal-root") {
    Write-Host "✅ portal-root trouvé dans index.html" -ForegroundColor Green
} else {
    Write-Host "⚠️  portal-root manquant dans dist/index.html" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Étape 3: Vérification Git" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

Set-Location ..

# Vérifier si Git est installé
Write-Host "Vérification de Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git trouvé: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Git n'est pas installé" -ForegroundColor Yellow
    Write-Host "   Téléchargez-le depuis: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
}

# Vérifier si .gitignore existe
if (-Not (Test-Path ".gitignore")) {
    Write-Host "Création de .gitignore..." -ForegroundColor Yellow
    @"
node_modules/
.env
dist/
build/
.DS_Store
*.log
.vercel
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✅ .gitignore créé" -ForegroundColor Green
} else {
    Write-Host "✅ .gitignore existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Préparation terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Créer un compte sur https://render.com" -ForegroundColor Yellow
Write-Host "2️⃣  Créer un compte sur https://vercel.com" -ForegroundColor Yellow
Write-Host "3️⃣  Créer un repository GitHub et pousser le code :" -ForegroundColor Yellow
Write-Host "    git init" -ForegroundColor White
Write-Host "    git add ." -ForegroundColor White
Write-Host "    git commit -m 'Initial commit'" -ForegroundColor White
Write-Host "    git remote add origin https://github.com/VOTRE-USERNAME/tableau-agent.git" -ForegroundColor White
Write-Host "    git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "4️⃣  Suivre le guide: DEPLOIEMENT_GRATUIT.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 Guide complet disponible dans: DEPLOIEMENT_GRATUIT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Votre application est prête pour le déploiement !" -ForegroundColor Green
Write-Host ""
