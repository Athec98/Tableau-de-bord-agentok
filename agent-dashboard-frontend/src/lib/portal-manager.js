/**
 * Gestionnaire global de portals pour éviter les erreurs removeChild
 * Solution définitive pour les problèmes de démontage de portals React
 */

class PortalManager {
  constructor() {
    this.portals = new Set();
    this.cleanup = this.cleanup.bind(this);
    
    if (typeof window !== 'undefined') {
      // Cleanup automatique avant le démontage
      window.addEventListener('beforeunload', this.cleanup);
    }
  }

  register(portalId) {
    this.portals.add(portalId);
  }

  unregister(portalId) {
    this.portals.delete(portalId);
  }

  cleanup() {
    requestAnimationFrame(() => {
      const portalRoot = document.getElementById('portal-root');
      if (portalRoot) {
        // Nettoyer les enfants un par un de manière sûre
        while (portalRoot.firstChild) {
          try {
            portalRoot.removeChild(portalRoot.firstChild);
          } catch (e) {
            // Silently ignore removeChild errors
            break;
          }
        }
      }
      this.portals.clear();
    });
  }

  safeCleanup(callback) {
    // Utiliser requestAnimationFrame pour éviter les erreurs de timing
    requestAnimationFrame(() => {
      try {
        callback();
      } catch (error) {
        // Silently ignore cleanup errors
      }
    });
  }
}

export const portalManager = new PortalManager();

// Cleanup global au changement de route
if (typeof window !== 'undefined') {
  let lastPath = window.location.pathname;
  
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      portalManager.safeCleanup(() => {
        const portalRoot = document.getElementById('portal-root');
        if (portalRoot && portalRoot.children.length > 0) {
          // Nettoyage sécurisé
          while (portalRoot.firstChild) {
            try {
              portalRoot.removeChild(portalRoot.firstChild);
            } catch (e) {
              break;
            }
          }
        }
      });
    }
  }, 100);
}
