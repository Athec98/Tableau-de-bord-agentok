# 🚨 Corrections Urgentes à Appliquer

## ✅ Déjà Corrigé

### 1. Numéro de Compte (Validation)
- ✅ Minimum 8 caractères
- ✅ Chiffres seuls OK (ex: 12345678)
- ✅ Lettres + chiffres OK (ex: CLI001234)
- ✅ Lettres seules INTERDIT (ex: ABCDEFGH)

---

## 🔧 À Corriger Maintenant

### 2. Bouton "Voir détails" dans Dashboard

**Fichier**: `c:\table\agent-dashboard-frontend\src\components\Dashboard.jsx`

**Ligne 170** - Remplacer :
```javascript
<Button variant="outline" size="sm">
  Voir détails
</Button>
```

Par :
```javascript
<Button 
  variant="outline" 
  size="sm"
  onClick={() => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }}
>
  Voir détails
</Button>
```

**À la fin du composant (avant `</div>` final)**, ajouter :

```javascript
      {/* Dialog des détails utilisateur */}
      {selectedUser && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l'utilisateur</DialogTitle>
              <DialogDescription>
                Informations complètes de l'utilisateur
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Photo et infos principales */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.photo} alt={`${selectedUser.prenom} ${selectedUser.nom}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {selectedUser.nom?.charAt(0)}{selectedUser.prenom?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.prenom} {selectedUser.nom}</h3>
                  <Badge className="mt-1">
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Numéro de compte</Label>
                  <p className="text-sm font-mono">{selectedUser.numeroCompte}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                  <p className="text-sm">{selectedUser.telephone}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                  <p className="text-sm">
                    {selectedUser.isActive ? (
                      <Badge className="bg-green-500">Actif</Badge>
                    ) : (
                      <Badge className="bg-red-500">Bloqué</Badge>
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Date de création</Label>
                  <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
```

---

### 3. Bouton "Paramètres" dans Header

**Fichier**: `c:\table\agent-dashboard-frontend\src\components\Header.jsx`

**Ligne 80** - Remplacer :
```javascript
<DropdownMenuItem className="cursor-pointer">
  <Settings className="mr-2 h-4 w-4" />
  <span>Paramètres</span>
</DropdownMenuItem>
```

Par :
```javascript
<DropdownMenuItem className="cursor-pointer" onClick={() => alert('Fonctionnalité Paramètres en cours de développement')}>
  <Settings className="mr-2 h-4 w-4" />
  <span>Paramètres</span>
</DropdownMenuItem>
```

Ou si vous voulez créer une vraie page Paramètres, remplacer par :
```javascript
<DropdownMenuItem className="cursor-pointer" onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}>
  <Settings className="mr-2 h-4 w-4" />
  <span>Paramètres</span>
</DropdownMenuItem>
```

---

## 📋 Résumé des Règles de Validation

### Numéro de Compte
- ✅ **12345678** (8 chiffres) → VALIDE
- ✅ **CLI001234** (lettres + chiffres, 9 caractères) → VALIDE
- ✅ **AGT12345** (lettres + chiffres, 8 caractères) → VALIDE
- ❌ **ABCDEFGH** (que des lettres) → INVALIDE
- ❌ **CLI001** (moins de 8 caractères) → INVALIDE
- ❌ **CLI-001234** (contient symbole) → INVALIDE

### Validation Complète
1. **Nom** : Lettres uniquement
2. **Prénom** : Lettres uniquement
3. **Email** : Format email valide
4. **Mot de passe** : Minimum 6 caractères
5. **Numéro compte** : 
   - Minimum 8 caractères
   - Lettres et/ou chiffres
   - Au moins 1 chiffre obligatoire
   - Pas de symboles ni espaces
6. **Téléphone** : Chiffres, +, -, espaces

---

## 🧪 Tests à Effectuer

### Test 1 : Numéro de Compte
```
1. Ouvrir "Ajouter Utilisateur"
2. Numéro compte : "ABCDEFGH" (8 lettres)
   ❌ Bouton désactivé + Message : "doit contenir au moins un chiffre"
3. Numéro compte : "12345678" (8 chiffres)
   ✅ Bouton actif
4. Numéro compte : "CLI001234" (lettres + chiffres)
   ✅ Bouton actif
5. Numéro compte : "CLI001" (7 caractères)
   ❌ Bouton désactivé + Message : "au moins 8 caractères"
```

### Test 2 : Voir Détails Dashboard
```
1. Aller dans Dashboard
2. Rechercher un utilisateur (ex: "agent")
3. Cliquer "Voir détails"
   ✅ Dialog s'ouvre avec toutes les infos
4. Vérifier : photo, nom, email, numéro compte, téléphone, statut
```

### Test 3 : Paramètres Header
```
1. Cliquer sur l'avatar en haut à droite
2. Cliquer "Paramètres"
   ✅ Message ou navigation vers page paramètres
```

---

## 🚀 Commandes de Redémarrage

Si nécessaire, redémarrez les serveurs :

```powershell
# Arrêter
Stop-Process -Name node -Force

# Terminal 1 - Backend
cd c:\table\backend
node server.js

# Terminal 2 - Frontend
cd c:\table\agent-dashboard-frontend
npm run dev
```

---

## ✅ Checklist Finale

- [x] Validation numéro compte : min 8 caractères
- [x] Validation numéro compte : chiffres seuls OK
- [x] Validation numéro compte : lettres+chiffres OK
- [x] Validation numéro compte : lettres seules INTERDIT
- [ ] Bouton "Voir détails" fonctionne
- [ ] Dialog détails s'affiche correctement
- [ ] Bouton "Paramètres" fonctionne

---

## 💡 Note Importante

Les corrections pour le numéro de compte sont **déjà appliquées** dans le code.
Il reste à appliquer manuellement :
1. Le bouton "Voir détails" dans Dashboard
2. Le bouton "Paramètres" dans Header

Ou je peux les appliquer automatiquement si vous voulez !
