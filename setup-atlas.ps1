# Script d'aide pour configurer MongoDB Atlas

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuration MongoDB Atlas" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Étapes à suivre :" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Créer un compte MongoDB Atlas (gratuit)" -ForegroundColor White
Write-Host "   👉 Ouverture du site dans votre navigateur..." -ForegroundColor Gray
Start-Sleep -Seconds 2
Start-Process "https://www.mongodb.com/cloud/atlas/register"

Write-Host ""
Write-Host "2️⃣  Créer un cluster gratuit (M0)" -ForegroundColor White
Write-Host "   - Provider : AWS/Azure/Google Cloud" -ForegroundColor Gray
Write-Host "   - Région : Paris (eu-west-3) ou proche" -ForegroundColor Gray
Write-Host "   - Cliquer 'Create Cluster' (attend 1-3 min)" -ForegroundColor Gray

Write-Host ""
Write-Host "3️⃣  Créer un utilisateur database" -ForegroundColor White
Write-Host "   - Username : admin" -ForegroundColor Gray
Write-Host "   - Password : admin123 (ou autre)" -ForegroundColor Gray
Write-Host "   ⚠️  NOTER LE MOT DE PASSE !" -ForegroundColor Red

Write-Host ""
Write-Host "4️⃣  Autoriser l'accès réseau" -ForegroundColor White
Write-Host "   - Network Access, Add IP Address" -ForegroundColor Gray
Write-Host "   - Choisir 'Allow Access from Anywhere' (0.0.0.0/0)" -ForegroundColor Gray

Write-Host ""
Write-Host "5️⃣  Obtenir la connection string" -ForegroundColor White
Write-Host "   - Database, Connect, Connect your application" -ForegroundColor Gray
Write-Host "   - Driver : Node.js" -ForegroundColor Gray
Write-Host "   - COPIER la connection string" -ForegroundColor Gray

Write-Host ""
Write-Host "6️⃣  Modifier le fichier .env" -ForegroundColor White
Write-Host "   📁 Fichier : backend\.env" -ForegroundColor Cyan
Write-Host "   📝 Ligne à modifier :" -ForegroundColor Gray
Write-Host "      MONGO_URI=mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/agent-dashboard..." -ForegroundColor DarkGray
Write-Host ""
Write-Host "   ⚠️  Remplacez :" -ForegroundColor Yellow
Write-Host "      - <password> par votre vrai mot de passe" -ForegroundColor Gray
Write-Host "      - xxxxx par votre cluster ID" -ForegroundColor Gray

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Demander si l'utilisateur veut ouvrir le fichier .env
$openEnv = Read-Host "Voulez-vous ouvrir le fichier .env maintenant ? (O/N)"
if ($openEnv -eq "O" -or $openEnv -eq "o") {
    $envPath = "C:\Tableau-de-bord-agent\backend\.env"
    if (Test-Path $envPath) {
        Write-Host "📝 Ouverture du fichier .env..." -ForegroundColor Green
        Start-Process notepad.exe $envPath
    } else {
        Write-Host "❌ Fichier .env introuvable : $envPath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📖 Consultez le guide complet : CONFIGURER_ATLAS.md" -ForegroundColor Cyan
Write-Host ""

# Demander si l'utilisateur veut ouvrir le guide
$openGuide = Read-Host "Voulez-vous ouvrir le guide complet ? (O/N)"
if ($openGuide -eq "O" -or $openGuide -eq "o") {
    $guidePath = "C:\Tableau-de-bord-agent\CONFIGURER_ATLAS.md"
    if (Test-Path $guidePath) {
        Write-Host "📖 Ouverture du guide..." -ForegroundColor Green
        Start-Process notepad.exe $guidePath
    }
}

Write-Host ""
Write-Host "✅ Une fois la configuration terminée, démarrez le backend :" -ForegroundColor Green
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Bonne configuration !" -ForegroundColor Cyan
Write-Host ""
