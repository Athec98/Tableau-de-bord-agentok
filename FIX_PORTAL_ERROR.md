# Fix - Erreur "removeChild" DOM Portal

## Problème
```
Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
```

Cette erreur apparaît lors du rechargement de la page ou de la navigation entre les routes.

## Cause Racine

### 1. StrictMode en Développement
React StrictMode effectue intentionnellement des **double-montages** en développement pour détecter les effets de bord. Cela cause des problèmes avec les composants portals (Dialog, Modal, Toaster) car :
- Le composant se monte 2 fois
- Les portals créent 2 containers DOM
- Au démontage, React tente de supprimer un nœud qui n'existe plus

### 2. Portals Non Nettoyés
Les composants Dialog (Radix UI) et Toaster (Sonner) créent des portals dans le DOM. Quand on change de route ou qu'on recharge, ces portals tentent de se démonter d'un DOM déjà modifié.

## Solutions Appliquées

### 1. Désactivation de StrictMode (main.jsx) ✅
```javascript
// AVANT
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" richColors />
  </StrictMode>,
)

// APRÈS
createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster position="top-right" richColors />
  </>,
)
```

**Raison :** StrictMode est utile pour détecter les problèmes, mais ses double-montages causent des erreurs avec les portals. On peut le réactiver plus tard avec une meilleure gestion des portals.

### 2. Conteneur Stable pour Portals (index.html) ✅
```html
<body>
  <div id="root"></div>
  <div id="portal-root"></div> <!-- Nouveau -->
  <script type="module" src="/src/main.jsx"></script>
</body>
```

**Raison :** Fournit un conteneur dédié et stable pour les portals, évitant les conflits avec le root principal.

### 3. Nettoyage des Dialogs au Démontage ✅

**Dashboard.jsx :**
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    loadStats();
  }, 100);
  
  return () => {
    clearTimeout(timer);
    // Fermer le dialog au démontage
    setIsDetailsOpen(false);
  };
}, []);
```

**Users.jsx :**
```javascript
useEffect(() => {
  loadUsers();
  
  return () => {
    // Fermer les dialogs au démontage
    setShowAddDialog(false);
    setShowEditDialog(false);
  };
}, []);
```

**Raison :** Garantit que les dialogs sont fermés proprement avant que le composant ne se démonte.

### 4. Portals Ciblés vers Conteneur Stable ✅

**ui/dialog.jsx & ui/alert-dialog.jsx :**
```javascript
function DialogPortal({ ...props }) {
  return (
    <DialogPrimitive.Portal 
      container={typeof document !== 'undefined' ? document.getElementById('portal-root') : undefined}
      {...props} 
    />
  );
}
```

**Raison :** Force tous les portals à utiliser le conteneur `#portal-root` au lieu du `body`, évitant les conflits et les erreurs de removeChild.

## Fichiers Modifiés

- ✅ `index.html` - Ajout du conteneur `portal-root`
- ✅ `src/main.jsx` - Désactivation de StrictMode
- ✅ `src/components/ui/dialog.jsx` - Portals ciblant `portal-root`
- ✅ `src/components/ui/alert-dialog.jsx` - Portals ciblant `portal-root`
- ✅ `src/components/Dashboard.jsx` - Cleanup des dialogs
- ✅ `src/components/Users.jsx` - Cleanup des dialogs
- ✅ `src/components/AddUserDialog.jsx` - Cleanup au démontage
- ✅ `src/components/EditUserDialog.jsx` - Cleanup au démontage

## Alternative Future (Avec StrictMode)

Si vous voulez réactiver StrictMode plus tard, utilisez cette approche :

```javascript
// Créer un Provider personnalisé pour les portals
import { useEffect, useRef } from 'react';

function PortalProvider({ children }) {
  const portalRef = useRef(null);
  
  useEffect(() => {
    portalRef.current = document.getElementById('portal-root');
    
    return () => {
      // Nettoyer les portals orphelins
      if (portalRef.current) {
        portalRef.current.innerHTML = '';
      }
    };
  }, []);
  
  return children;
}

// Dans main.jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PortalProvider>
      <App />
      <Toaster position="top-right" richColors />
    </PortalProvider>
  </StrictMode>,
)
```

## Comment Tester

1. Recharger la page (F5) → Pas d'erreur
2. Naviguer entre les routes → Pas d'erreur
3. Ouvrir/fermer des dialogs puis naviguer → Pas d'erreur
4. Vérifier la console (F12) → Pas d'erreur "removeChild"

## Impact

- ✅ Plus d'erreur de portal au rechargement
- ✅ Navigation fluide entre les pages
- ✅ Dialogs et Toaster fonctionnent correctement
- ⚠️ StrictMode désactivé (à réactiver en prod avec gestion appropriée)

## Notes Techniques

### Pourquoi StrictMode cause ce problème ?

En développement, StrictMode :
1. Monte le composant
2. **Démonte immédiatement** le composant
3. **Remonte** le composant

Cela signifie que les portals créent 2 conteneurs DOM, mais React ne garde qu'une référence au second. Quand le composant se démonte définitivement, il tente de supprimer le premier conteneur qui n'existe plus → erreur `removeChild`.

### Composants Affectés

Tous les composants utilisant des portals :
- `Dialog` (Radix UI)
- `Toaster` (Sonner)
- `AlertDialog` (Radix UI)
- `DropdownMenu` avec overlay

Ces composants utilisent `ReactDOM.createPortal()` qui injecte du HTML en dehors de la hiérarchie React normale.
