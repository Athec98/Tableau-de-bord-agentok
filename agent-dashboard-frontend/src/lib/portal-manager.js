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
    const portalRoot = document.getElementById('portal-root');
    if (portalRoot) {
      // Vider complètement le conteneur portal
      portalRoot.innerHTML = '';
    }
    this.portals.clear();
  }

  safeCleanup(callback) {
    // Exécuter le callback après un délai pour éviter les erreurs de timing
    setTimeout(() => {
      try {
        callback();
      } catch (error) {
        console.warn('Portal cleanup warning:', error);
      }
    }, 0);
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
          portalRoot.innerHTML = '';
        }
      });
    }
  }, 100);
}
