import { useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour gérer le nettoyage des dialogs
 * Évite les erreurs de portal removeChild
 */
export function useDialogCleanup(isOpen, onClose) {
  const cleanupRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup au démontage du composant
      if (isOpen && onClose) {
        // Utiliser requestAnimationFrame pour éviter les erreurs de timing
        cleanupRef.current = requestAnimationFrame(() => {
          try {
            onClose(false);
          } catch (error) {
            console.warn('Dialog cleanup warning:', error);
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cancelAnimationFrame(cleanupRef.current);
      }
    };
  }, []);
}

/**
 * Hook pour nettoyer multiple dialogs
 */
export function useMultiDialogCleanup(dialogs) {
  useEffect(() => {
    return () => {
      requestAnimationFrame(() => {
        dialogs.forEach(({ isOpen, onClose }) => {
          if (isOpen && onClose) {
            try {
              onClose(false);
            } catch (error) {
              console.warn('Multi-dialog cleanup warning:', error);
            }
          }
        });
      });
    };
  }, []);
}
