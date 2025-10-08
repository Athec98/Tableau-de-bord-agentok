# Script de test des connexions
Write-Host "🧪 Test des connexions..." -ForegroundColor Green

# Test 1: Vérifier que les ports sont libres
Write-Host "`n🔍 Vérification des ports..." -ForegroundColor Yellow

$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "⚠️  Port 5000 déjà utilisé" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 5000 libre" -ForegroundColor Green
}

if ($port5173) {
    Write-Host "⚠️  Port 5173 déjà utilisé" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 5173 libre" -ForegroundColor Green
}

# Test 2: Vérifier les dépendances
Write-Host "`n📦 Vérification des dépendances..." -ForegroundColor Yellow

# Backend
if (Test-Path "backend\node_modules") {
    Write-Host "✅ Backend: node_modules présent" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: node_modules manquant - exécutez: cd backend && npm install" -ForegroundColor Red
}

# Frontend
if (Test-Path "agent-dashboard-frontend\node_modules") {
    Write-Host "✅ Frontend: node_modules présent" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend: node_modules manquant - exécutez: cd agent-dashboard-frontend && npm install" -ForegroundColor Red
}

# Test 3: Vérifier les fichiers de configuration
Write-Host "`n📄 Vérification des fichiers de configuration..." -ForegroundColor Yellow

if (Test-Path "backend\package.json") {
    Write-Host "✅ Backend: package.json présent" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: package.json manquant" -ForegroundColor Red
}

if (Test-Path "agent-dashboard-frontend\package.json") {
    Write-Host "✅ Frontend: package.json présent" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend: package.json manquant" -ForegroundColor Red
}

if (Test-Path "backend\server.js") {
    Write-Host "✅ Backend: server.js présent" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: server.js manquant" -ForegroundColor Red
}

# Test 4: Vérifier MongoDB
Write-Host "`n🗄️  Vérification de MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB en cours d'exécution" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB non détecté - assurez-vous qu'il est démarré" -ForegroundColor Yellow
        Write-Host "   Commande: mongod --dbpath C:\data\db" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️  Impossible de vérifier MongoDB" -ForegroundColor Yellow
}

Write-Host "`n🎯 Résumé des tests:" -ForegroundColor Cyan
Write-Host "1. Exécutez: .\setup-env.ps1" -ForegroundColor White
Write-Host "2. Démarrer MongoDB si nécessaire" -ForegroundColor White
Write-Host "3. Exécutez: .\start-dev.ps1" -ForegroundColor White
Write-Host "4. Ouvrez: http://localhost:5173" -ForegroundColor White
