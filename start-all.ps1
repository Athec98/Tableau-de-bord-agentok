# Script pour démarrer le Backend et le Frontend ensemble

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Démarrage Backend + Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Node.js est installé
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Write-Host "   Installez Node.js depuis https://nodejs.org" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Node.js $nodeVersion détecté" -ForegroundColor Green

# Démarrer le Backend
Write-Host ""
Write-Host "🚀 Démarrage du Backend (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\backend; Write-Host '=== BACKEND SERVER ===' -ForegroundColor Cyan; node server.js"
Start-Sleep -Seconds 2

# Vérifier si le backend répond
Write-Host "   Vérification du backend..." -ForegroundColor Gray
$backendOk = $false
for ($i = 1; $i -le 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendOk = $true
            break
        }
    } catch {
        Start-Sleep -Seconds 1
    }
}

if ($backendOk) {
    Write-Host "✅ Backend démarré avec succès sur http://localhost:5000" -ForegroundColor Green
} else {
    Write-Host "⚠️  Le backend ne répond pas encore (peut prendre quelques secondes)" -ForegroundColor Yellow
}

# Démarrer le Frontend
Write-Host ""
Write-Host "🚀 Démarrage du Frontend (port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Tableau-de-bord-agent\agent-dashboard-frontend; Write-Host '=== FRONTEND SERVER ===' -ForegroundColor Magenta; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Serveurs en cours de démarrage" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "👉 Ouvrez votre navigateur à:" -ForegroundColor Yellow
Write-Host "   http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Pour arrêter les serveurs, fermez les fenêtres PowerShell." -ForegroundColor Gray
Write-Host ""

# Attendre 3 secondes puis ouvrir le navigateur
Write-Host "Ouverture du navigateur dans 3 secondes..." -ForegroundColor Gray
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"
