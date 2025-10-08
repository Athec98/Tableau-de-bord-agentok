import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

/**
 * SafeDialog - Wrapper pour Dialog qui évite les erreurs de portal removeChild
 * Utilise un ref pour garantir un démontage propre
 */
export function SafeDialog({ open, onOpenChange, children, ...props }) {
  const isOpenRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    isOpenRef.current = open;
    
    return () => {
      // Cleanup asynchrone pour éviter les erreurs de timing
      if (isOpenRef.current) {
        timeoutRef.current = setTimeout(() => {
          if (onOpenChange) {
            onOpenChange(false);
          }
        }, 0);
      }
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    return () => {
      // Cleanup final au démontage du composant
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      {children}
    </Dialog>
  );
}

// Ré-exporter les composants pour faciliter l'utilisation
export { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle };
