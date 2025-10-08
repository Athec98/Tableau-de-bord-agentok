# Script de deploiement - Tableau de Bord Agent
# Automatise la preparation du deploiement

Write-Host "====================================" -ForegroundColor Cyan
Write-Host " PREPARATION DU DEPLOIEMENT" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verification Node.js
Write-Host "[1/5] Verification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "OK - Node.js trouve: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR - Node.js n'est pas installe !" -ForegroundColor Red
    Write-Host "Telechargez-le sur: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Verification npm
try {
    $npmVersion = npm -v
    Write-Host "OK - npm trouve: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR - npm n'est pas installe !" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/5] Installation des dependances..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Cyan

# Backend
Write-Host "Backend..." -ForegroundColor Yellow
Set-Location backend
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installation en cours..." -ForegroundColor Yellow
    npm install
}
Write-Host "OK - Backend pret" -ForegroundColor Green

# Frontend
Set-Location ..\agent-dashboard-frontend
Write-Host "Frontend..." -ForegroundColor Yellow
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installation en cours..." -ForegroundColor Yellow
    npm install
}
Write-Host "OK - Frontend pret" -ForegroundColor Green

Write-Host ""
Write-Host "[3/5] Build du Frontend..." -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Cyan

# Demander l'URL du backend
Write-Host ""
Write-Host "URL du backend Render (exemple: https://mon-app.onrender.com/api)" -ForegroundColor Yellow
$backendUrl = Read-Host "Entrez l'URL de votre backend Render (ou Entree pour localhost)"

if ([string]::IsNullOrWhiteSpace($backendUrl)) {
    $backendUrl = "http://localhost:5000/api"
    Write-Host "Utilisation de l'URL locale: $backendUrl" -ForegroundColor Cyan
}

# Creer .env.production
Write-Host "Creation de .env.production..." -ForegroundColor Yellow
Set-Content -Path ".env.production" -Value "VITE_API_URL=$backendUrl" -Encoding UTF8
Write-Host "OK - .env.production cree" -ForegroundColor Green

# Build
Write-Host "Build en cours (peut prendre 1-2 minutes)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR lors du build !" -ForegroundColor Red
    exit 1
}
Write-Host "OK - Build termine" -ForegroundColor Green

# Verifier dist
if (-Not (Test-Path "dist")) {
    Write-Host "ERREUR - Dossier dist non cree !" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[4/5] Verification Git..." -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Cyan

Set-Location ..

# Verifier si Git est installe
Write-Host "Verification de Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "OK - Git trouve: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ATTENTION - Git n'est pas installe" -ForegroundColor Yellow
    Write-Host "Telechargez-le: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
}

# Verifier si .gitignore existe
if (-Not (Test-Path ".gitignore")) {
    Write-Host "Creation de .gitignore..." -ForegroundColor Yellow
    $gitignoreContent = @"
node_modules/
.env
dist/
build/
.DS_Store
*.log
.vercel
"@
    Set-Content -Path ".gitignore" -Value $gitignoreContent -Encoding UTF8
    Write-Host "OK - .gitignore cree" -ForegroundColor Green
} else {
    Write-Host "OK - .gitignore existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "[5/5] Verification finale..." -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Cyan

$indexPath = "agent-dashboard-frontend\dist\index.html"
if (Test-Path $indexPath) {
    $indexContent = Get-Content $indexPath -Raw
    if ($indexContent -match "portal-root") {
        Write-Host "OK - portal-root trouve dans index.html" -ForegroundColor Green
    } else {
        Write-Host "ATTENTION - portal-root manquant" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host " PREPARATION TERMINEE !" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "PROCHAINES ETAPES :" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Creer un compte GitHub (gratuit)" -ForegroundColor Yellow
Write-Host "   https://github.com" -ForegroundColor White
Write-Host ""
Write-Host "2. Creer un repository et pousser le code :" -ForegroundColor Yellow
Write-Host "   git init" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor White
Write-Host '   git commit -m "Initial commit"' -ForegroundColor White
Write-Host "   git remote add origin https://github.com/VOTRE-USERNAME/tableau-agent.git" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "3. Deployer le backend sur Render.com (gratuit)" -ForegroundColor Yellow
Write-Host "   https://render.com" -ForegroundColor White
Write-Host ""
Write-Host "4. Deployer le frontend sur Vercel.com (gratuit)" -ForegroundColor Yellow
Write-Host "   https://vercel.com" -ForegroundColor White
Write-Host ""
Write-Host "Guide complet : Ouvrir DEPLOIEMENT_GRATUIT.md" -ForegroundColor Cyan
Write-Host ""
