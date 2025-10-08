# Script pour demarrer MongoDB 7.0 avec une base vide
# A executer en tant qu'administrateur

Write-Host "=== Nettoyage et redemarrage MongoDB ===" -ForegroundColor Cyan

# Arreter le service
Write-Host "`n1. Arret du service MongoDB..." -ForegroundColor Yellow
Stop-Service MongoDB -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
Write-Host "   OK Service arrete" -ForegroundColor Green

# Supprimer les donnees incompatibles
Write-Host "`n2. Suppression des donnees incompatibles..." -ForegroundColor Yellow
Remove-Item "C:\Program Files\MongoDB\Server\7.0\data\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   OK Donnees supprimees" -ForegroundColor Green

# Redemarrer avec une base vide
Write-Host "`n3. Demarrage de MongoDB avec une base vide..." -ForegroundColor Yellow
Start-Service MongoDB
Start-Sleep -Seconds 5

# Verifier
$service = Get-Service MongoDB
if ($service.Status -eq "Running") {
    Write-Host "   OK MongoDB demarre avec succes" -ForegroundColor Green
    Write-Host "`n=== MongoDB 7.0 est pret ===" -ForegroundColor Green
    Write-Host "Connexion: mongodb://localhost:27017/agent_dashboard_db" -ForegroundColor Cyan
} else {
    Write-Host "   ERREUR Echec du demarrage" -ForegroundColor Red
    exit 1
}
