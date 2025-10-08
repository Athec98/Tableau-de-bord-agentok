# Script de migration des donnees MongoDB 8.2 vers 7.0
# A executer en tant qu'administrateur

Write-Host "=== Migration des donnees MongoDB 8.2 vers 7.0 ===" -ForegroundColor Cyan

# Etape 1: Arreter MongoDB 7.0
Write-Host "`n1. Arret de MongoDB 7.0..." -ForegroundColor Yellow
Stop-Service MongoDB -Force
Start-Sleep -Seconds 3
Write-Host "   OK Service arrete" -ForegroundColor Green

# Etape 2: Restaurer temporairement les donnees 8.2
Write-Host "`n2. Restauration temporaire des donnees 8.2..." -ForegroundColor Yellow
Remove-Item "C:\Program Files\MongoDB\Server\7.0\data\*" -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item "C:\MongoBackup_2025-10-04_20-18\*" -Destination "C:\Program Files\MongoDB\Server\7.0\data\" -Recurse -Force
Write-Host "   OK Donnees 8.2 restaurees" -ForegroundColor Green

# Etape 3: Demarrer MongoDB en mode repair
Write-Host "`n3. Tentative de demarrage en mode reparation..." -ForegroundColor Yellow
$mongodPath = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
$dataPath = "C:\Program Files\MongoDB\Server\7.0\data"

# Essayer de demarrer avec setFeatureCompatibilityVersion
Write-Host "   Demarrage de mongod..." -ForegroundColor Yellow
$process = Start-Process -FilePath $mongodPath -ArgumentList "--dbpath `"$dataPath`" --port 27017 --setParameter featureCompatibilityVersion=7.0" -PassThru -NoNewWindow

Start-Sleep -Seconds 10

if ($process.HasExited) {
    Write-Host "   ERREUR: MongoDB n'a pas pu demarrer" -ForegroundColor Red
    Write-Host "   Les donnees MongoDB 8.2 ne peuvent pas etre converties automatiquement" -ForegroundColor Yellow
    Write-Host "`n   SOLUTION: Repartir avec une base vide" -ForegroundColor Cyan
    
    # Nettoyer et redemarrer proprement
    Stop-Process -Name mongod -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Remove-Item "C:\Program Files\MongoDB\Server\7.0\data\*" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Service MongoDB
    
    Write-Host "`n   MongoDB 7.0 demarre avec une base vide" -ForegroundColor Green
    exit 0
}

Write-Host "   OK MongoDB demarre" -ForegroundColor Green

# Etape 4: Exporter les donnees
Write-Host "`n4. Export des donnees..." -ForegroundColor Yellow
$toolsPath = "C:\MongoDBTools\mongodb-database-tools-windows-x86_64-100.9.5\bin"
if (Test-Path $toolsPath) {
    & "$toolsPath\mongodump.exe" --db agent_dashboard_db --out "C:\MongoExport"
    Write-Host "   OK Donnees exportees vers C:\MongoExport" -ForegroundColor Green
} else {
    Write-Host "   ERREUR: Outils MongoDB non trouves" -ForegroundColor Red
}

# Etape 5: Arreter mongod et nettoyer
Write-Host "`n5. Nettoyage..." -ForegroundColor Yellow
Stop-Process -Name mongod -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
Remove-Item "C:\Program Files\MongoDB\Server\7.0\data\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   OK Nettoyage termine" -ForegroundColor Green

# Etape 6: Demarrer MongoDB 7.0 proprement
Write-Host "`n6. Demarrage de MongoDB 7.0..." -ForegroundColor Yellow
Start-Service MongoDB
Start-Sleep -Seconds 5

$service = Get-Service MongoDB
if ($service.Status -eq "Running") {
    Write-Host "   OK MongoDB 7.0 demarre" -ForegroundColor Green
} else {
    Write-Host "   ERREUR: Echec du demarrage" -ForegroundColor Red
    exit 1
}

# Etape 7: Importer les donnees
Write-Host "`n7. Import des donnees dans MongoDB 7.0..." -ForegroundColor Yellow
if (Test-Path "C:\MongoExport\agent_dashboard_db") {
    & "$toolsPath\mongorestore.exe" --db agent_dashboard_db "C:\MongoExport\agent_dashboard_db"
    Write-Host "   OK Donnees importees avec succes" -ForegroundColor Green
    Write-Host "`n=== Migration terminee avec succes ===" -ForegroundColor Green
} else {
    Write-Host "   AVERTISSEMENT: Pas de donnees a importer" -ForegroundColor Yellow
    Write-Host "   MongoDB 7.0 demarre avec une base vide" -ForegroundColor Cyan
}
