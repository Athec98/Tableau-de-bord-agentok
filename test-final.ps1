# Script de test final
Write-Host "🧪 Test Final - Agent Dashboard" -ForegroundColor Green

# Test 1: Vérifier les fichiers .env
Write-Host "`n📄 Vérification des fichiers .env..." -ForegroundColor Yellow

if (Test-Path "backend\.env") {
    Write-Host "✅ Backend: .env présent" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: .env manquant - exécutez: .\setup-env.ps1" -ForegroundColor Red
}

if (Test-Path "agent-dashboard-frontend\.env") {
    Write-Host "✅ Frontend: .env présent" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend: .env manquant - exécutez: .\setup-env.ps1" -ForegroundColor Red
}

# Test 2: Vérifier les dépendances
Write-Host "`n📦 Vérification des dépendances..." -ForegroundColor Yellow

if (Test-Path "backend\node_modules") {
    Write-Host "✅ Backend: Dépendances installées" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: Dépendances manquantes - exécutez: cd backend && npm install" -ForegroundColor Red
}

if (Test-Path "agent-dashboard-frontend\node_modules") {
    Write-Host "✅ Frontend: Dépendances installées" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend: Dépendances manquantes - exécutez: cd agent-dashboard-frontend && npm install" -ForegroundColor Red
}

# Test 3: Vérifier les scripts
Write-Host "`n🔧 Vérification des scripts..." -ForegroundColor Yellow

$backendPackage = Get-Content "backend\package.json" | ConvertFrom-Json
if ($backendPackage.scripts.start) {
    Write-Host "✅ Backend: Script start présent" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: Script start manquant" -ForegroundColor Red
}

if ($backendPackage.scripts.dev) {
    Write-Host "✅ Backend: Script dev présent" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: Script dev manquant" -ForegroundColor Red
}

# Test 4: Vérifier les ports
Write-Host "`n🌐 Vérification des ports..." -ForegroundColor Yellow

$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "⚠️  Port 5000 utilisé (backend peut-être déjà démarré)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 5000 libre" -ForegroundColor Green
}

if ($port5173) {
    Write-Host "⚠️  Port 5173 utilisé (frontend peut-être déjà démarré)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 5173 libre" -ForegroundColor Green
}

# Test 5: Vérifier MongoDB
Write-Host "`n🗄️  Vérification de MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB en cours d'exécution" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB non détecté" -ForegroundColor Yellow
        Write-Host "   Démarrer avec: mongod --dbpath C:\data\db" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️  Impossible de vérifier MongoDB" -ForegroundColor Yellow
}

Write-Host "`n🎯 Instructions de démarrage:" -ForegroundColor Cyan
Write-Host "1. Si .env manquant: .\setup-env.ps1" -ForegroundColor White
Write-Host "2. Si dépendances manquantes: cd backend && npm install" -ForegroundColor White
Write-Host "3. Si dépendances frontend manquantes: cd agent-dashboard-frontend && npm install" -ForegroundColor White
Write-Host "4. Démarrer MongoDB: mongod --dbpath C:\data\db" -ForegroundColor White
Write-Host "5. Démarrer l'application: .\start-dev.ps1" -ForegroundColor White

Write-Host "`n🌐 URLs d'accès:" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend: http://localhost:5000" -ForegroundColor White
Write-Host "API: http://localhost:5000/api" -ForegroundColor White

Write-Host "`n🔑 Identifiants de test:" -ForegroundColor Cyan
Write-Host "Email: agent@example.com" -ForegroundColor White
Write-Host "Compte: AGT001" -ForegroundColor White
Write-Host "Mot de passe: (n'importe quoi)" -ForegroundColor White

Write-Host "`n✅ Test terminé!" -ForegroundColor Green
