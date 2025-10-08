# Script de redémarrage rapide pour tests

Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🔄 REDÉMARRAGE BACKEND + FRONTEND" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Fonction pour tuer les processus node sur le port 5000
function Stop-BackendProcess {
    Write-Host "🛑 Arrêt du backend (port 5000)..." -ForegroundColor Yellow
    $process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Backend arrêté" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  Aucun backend en cours" -ForegroundColor Gray
    }
    Start-Sleep -Seconds 1
}

# Fonction pour tuer les processus sur le port 5173
function Stop-FrontendProcess {
    Write-Host "🛑 Arrêt du frontend (port 5173)..." -ForegroundColor Yellow
    $process = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($process) {
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Frontend arrêté" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  Aucun frontend en cours" -ForegroundColor Gray
    }
    Start-Sleep -Seconds 1
}

# Arrêter les processus existants
Stop-BackendProcess
Stop-FrontendProcess

Write-Host ""
Write-Host "🚀 Démarrage des serveurs..." -ForegroundColor Cyan
Write-Host ""

# Démarrer le Backend
Write-Host "▶️  Démarrage BACKEND (C:\backend)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\backend; Write-Host '═══════════════════════════════════════' -ForegroundColor Cyan; Write-Host '   🖥️  BACKEND SERVER - Port 5000' -ForegroundColor Cyan; Write-Host '═══════════════════════════════════════' -ForegroundColor Cyan; node server.js"
Start-Sleep -Seconds 3

# Vérifier le backend
Write-Host "   Vérification backend..." -ForegroundColor Gray
$backendOk = $false
for ($i = 1; $i -le 5; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendOk = $true
            Write-Host "   ✅ Backend accessible" -ForegroundColor Green
            break
        }
    } catch {
        Start-Sleep -Seconds 1
    }
}

if (-not $backendOk) {
    Write-Host "   ⚠️  Backend ne répond pas encore" -ForegroundColor Yellow
    Write-Host "      Attendez quelques secondes..." -ForegroundColor Gray
}

Write-Host ""

# Démarrer le Frontend
Write-Host "▶️  Démarrage FRONTEND (agent-dashboard-frontend)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Tableau-de-bord-agent\agent-dashboard-frontend; Write-Host '═══════════════════════════════════════' -ForegroundColor Magenta; Write-Host '   🌐 FRONTEND SERVER - Port 5173' -ForegroundColor Magenta; Write-Host '═══════════════════════════════════════' -ForegroundColor Magenta; npm run dev"

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host "   ✅ SERVEURS EN COURS DE DÉMARRAGE" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Magenta
Write-Host ""
Write-Host "🔐 Identifiants de test:" -ForegroundColor White
Write-Host "   Email:    agent1@example.com" -ForegroundColor Cyan
Write-Host "   Password: password123" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Patientez 5 secondes..." -ForegroundColor Gray
Start-Sleep -Seconds 5

Write-Host "🌐 Ouverture du navigateur..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✅ Prêt à tester !" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Conseils:" -ForegroundColor Yellow
Write-Host "   - Ouvrez la Console (F12) pour voir les erreurs" -ForegroundColor White
Write-Host "   - Vérifiez l'onglet Network pour les requêtes API" -ForegroundColor White
Write-Host "   - Testez: Dashboard → Utilisateurs → Dépôt → Historique" -ForegroundColor White
Write-Host ""
