# Script de restauration des donnees MongoDB
# A executer en tant qu'administrateur

Write-Host "=== Restauration des donnees MongoDB ===" -ForegroundColor Cyan

# Arreter le service MongoDB
Write-Host "`n1. Arret du service MongoDB..." -ForegroundColor Yellow
Stop-Service MongoDB -Force
Start-Sleep -Seconds 3

# Verifier que le service est arrete
$service = Get-Service MongoDB
if ($service.Status -eq "Stopped") {
    Write-Host "   OK Service arrete" -ForegroundColor Green
} else {
    Write-Host "   ERREUR Echec de l'arret du service" -ForegroundColor Red
    exit 1
}

# Sauvegarder les donnees actuelles (vides)
Write-Host "`n2. Sauvegarde des donnees actuelles..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$currentBackup = "C:\MongoBackup_Current_$timestamp"
if (Test-Path "C:\Program Files\MongoDB\Server\7.0\data") {
    Copy-Item "C:\Program Files\MongoDB\Server\7.0\data" -Destination $currentBackup -Recurse -Force
    Write-Host "   OK Sauvegarde creee: $currentBackup" -ForegroundColor Green
}

# Supprimer les donnees actuelles
Write-Host "`n3. Suppression des donnees actuelles..." -ForegroundColor Yellow
Remove-Item "C:\Program Files\MongoDB\Server\7.0\data\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   OK Donnees supprimees" -ForegroundColor Green

# Restaurer les anciennes donnees
Write-Host "`n4. Restauration des donnees sauvegardees..." -ForegroundColor Yellow
Copy-Item "C:\MongoBackup_2025-10-04_20-18\*" -Destination "C:\Program Files\MongoDB\Server\7.0\data\" -Recurse -Force
Write-Host "   OK Donnees restaurees" -ForegroundColor Green

# Redemarrer le service MongoDB
Write-Host "`n5. Redemarrage du service MongoDB..." -ForegroundColor Yellow
Start-Service MongoDB
Start-Sleep -Seconds 5

# Verifier que le service est demarre
$service = Get-Service MongoDB
if ($service.Status -eq "Running") {
    Write-Host "   OK Service demarre" -ForegroundColor Green
} else {
    Write-Host "   ERREUR Echec du demarrage du service" -ForegroundColor Red
    Write-Host "   Verifiez les logs: C:\Program Files\MongoDB\Server\7.0\log\mongod.log" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n=== Restauration terminee avec succes ===" -ForegroundColor Green
Write-Host "`nVos donnees ont ete restaurees depuis la sauvegarde du 04/10/2025 20:18" -ForegroundColor Cyan
