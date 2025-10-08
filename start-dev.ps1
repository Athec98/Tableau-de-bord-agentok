# Script de démarrage pour le développement
# Ce script démarre le backend et le frontend en parallèle

Write-Host "🚀 Démarrage de l'application Agent Dashboard..." -ForegroundColor Green

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez installer Node.js d'abord." -ForegroundColor Red
    exit 1
}

# Vérifier si MongoDB est en cours d'exécution
Write-Host "🔍 Vérification de MongoDB..." -ForegroundColor Yellow
try {
    $mongoStatus = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
    if ($mongoStatus) {
        Write-Host "✅ MongoDB est en cours d'exécution" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB n'est pas en cours d'exécution. Veuillez démarrer MongoDB d'abord." -ForegroundColor Yellow
        Write-Host "   Vous pouvez utiliser: mongod --dbpath C:\data\db" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️  Impossible de vérifier le statut de MongoDB" -ForegroundColor Yellow
}

# Démarrer le backend
Write-Host "🔧 Démarrage du backend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

# Attendre un peu pour que le backend démarre
Start-Sleep -Seconds 3

# Démarrer le frontend
Write-Host "🎨 Démarrage du frontend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd agent-dashboard-frontend; npm run dev" -WindowStyle Normal

Write-Host "✅ Services démarrés!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📊 API: http://localhost:5000/api" -ForegroundColor Cyan

Write-Host "`nAppuyez sur une touche pour fermer ce script..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
