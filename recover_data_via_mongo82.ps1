# Script pour recuperer les donnees via MongoDB 8.2
# A executer en tant qu'administrateur

Write-Host "=== Recuperation des donnees via MongoDB 8.2 ===" -ForegroundColor Cyan

# Etape 1: Arreter MongoDB 7.0
Write-Host "`n1. Arret de MongoDB 7.0..." -ForegroundColor Yellow
Stop-Service MongoDB -Force
Start-Sleep -Seconds 3
Write-Host "   OK" -ForegroundColor Green

# Etape 2: Sauvegarder l'installation 7.0
Write-Host "`n2. Sauvegarde de MongoDB 7.0..." -ForegroundColor Yellow
if (Test-Path "C:\Program Files\MongoDB\Server\7.0") {
    Rename-Item "C:\Program Files\MongoDB\Server\7.0" "C:\Program Files\MongoDB\Server\7.0_backup"
    Write-Host "   OK Sauvegarde creee" -ForegroundColor Green
}

# Etape 3: Installer MongoDB 8.2
Write-Host "`n3. Installation de MongoDB 8.2..." -ForegroundColor Yellow
Write-Host "   Telechargement en cours..." -ForegroundColor Cyan
$url = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.0.3-signed.msi"
$output = "$env:USERPROFILE\Downloads\mongodb-8.0.3.msi"
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "   Installation en cours (cela peut prendre quelques minutes)..." -ForegroundColor Cyan
Start-Process msiexec.exe -ArgumentList "/i `"$output`" /qn ADDLOCAL=ServerNoService" -Wait
Write-Host "   OK MongoDB 8.0 installe" -ForegroundColor Green

# Etape 4: Restaurer les donnees 8.2
Write-Host "`n4. Restauration des donnees 8.2..." -ForegroundColor Yellow
$dataPath = "C:\Program Files\MongoDB\Server\8.0\data"
if (-not (Test-Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
}
Copy-Item "C:\MongoBackup_2025-10-04_20-18\*" -Destination $dataPath -Recurse -Force
Write-Host "   OK Donnees restaurees" -ForegroundColor Green

# Etape 5: Demarrer MongoDB 8.0 manuellement
Write-Host "`n5. Demarrage de MongoDB 8.0..." -ForegroundColor Yellow
$mongodPath = "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
$logPath = "C:\Program Files\MongoDB\Server\8.0\log"
if (-not (Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath -Force | Out-Null
}

$process = Start-Process -FilePath $mongodPath -ArgumentList "--dbpath `"$dataPath`" --port 27017 --logpath `"$logPath\mongod.log`"" -PassThru -WindowStyle Hidden

Write-Host "   Attente du demarrage..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Verifier si MongoDB demarre
$mongoRunning = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "   OK MongoDB 8.0 demarre" -ForegroundColor Green
    
    # Etape 6: Exporter les donnees
    Write-Host "`n6. Export des donnees..." -ForegroundColor Yellow
    $toolsPath = "C:\MongoDBTools\mongodb-database-tools-windows-x86_64-100.9.5\bin"
    
    if (Test-Path $toolsPath) {
        & "$toolsPath\mongodump.exe" --host localhost:27017 --db agent_dashboard_db --out "C:\MongoExport_Final"
        Write-Host "   OK Donnees exportees vers C:\MongoExport_Final" -ForegroundColor Green
    } else {
        Write-Host "   ERREUR: Outils MongoDB non trouves" -ForegroundColor Red
        Write-Host "   Telechargez-les manuellement depuis:" -ForegroundColor Yellow
        Write-Host "   https://www.mongodb.com/try/download/database-tools" -ForegroundColor Cyan
    }
    
    # Etape 7: Arreter MongoDB 8.0
    Write-Host "`n7. Arret de MongoDB 8.0..." -ForegroundColor Yellow
    Stop-Process -Name mongod -Force
    Start-Sleep -Seconds 3
    Write-Host "   OK" -ForegroundColor Green
    
} else {
    Write-Host "   ERREUR: MongoDB 8.0 n'a pas demarre" -ForegroundColor Red
    Write-Host "   Verifiez les logs: $logPath\mongod.log" -ForegroundColor Yellow
}

# Etape 8: Restaurer MongoDB 7.0
Write-Host "`n8. Restauration de MongoDB 7.0..." -ForegroundColor Yellow
if (Test-Path "C:\Program Files\MongoDB\Server\7.0_backup") {
    Remove-Item "C:\Program Files\MongoDB\Server\8.0" -Recurse -Force -ErrorAction SilentlyContinue
    Rename-Item "C:\Program Files\MongoDB\Server\7.0_backup" "C:\Program Files\MongoDB\Server\7.0"
    Write-Host "   OK MongoDB 7.0 restaure" -ForegroundColor Green
}

# Etape 9: Demarrer MongoDB 7.0
Write-Host "`n9. Demarrage de MongoDB 7.0..." -ForegroundColor Yellow
Start-Service MongoDB
Start-Sleep -Seconds 5

$service = Get-Service MongoDB
if ($service.Status -eq "Running") {
    Write-Host "   OK MongoDB 7.0 demarre" -ForegroundColor Green
} else {
    Write-Host "   ERREUR: Echec du demarrage" -ForegroundColor Red
}

# Etape 10: Importer les donnees
Write-Host "`n10. Import des donnees dans MongoDB 7.0..." -ForegroundColor Yellow
if (Test-Path "C:\MongoExport_Final\agent_dashboard_db") {
    $toolsPath = "C:\MongoDBTools\mongodb-database-tools-windows-x86_64-100.9.5\bin"
    & "$toolsPath\mongorestore.exe" --host localhost:27017 --db agent_dashboard_db "C:\MongoExport_Final\agent_dashboard_db"
    Write-Host "   OK Donnees importees avec succes!" -ForegroundColor Green
    Write-Host "`n=== SUCCES: Vos donnees ont ete recuperees! ===" -ForegroundColor Green
} else {
    Write-Host "   AVERTISSEMENT: Pas de donnees exportees" -ForegroundColor Yellow
}

Write-Host "`nMongoDB 7.0 est pret avec vos donnees restaurees" -ForegroundColor Cyan
