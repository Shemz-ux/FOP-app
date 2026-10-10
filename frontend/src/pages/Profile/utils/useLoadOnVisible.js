import { useEffect } from 'react';

// Runs load when the page opens, and again each time the user returns to the browser tab.
// Pass a function wrapped in useCallback so it only re-runs when its inputs change.
export function useLoadOnVisible(load) {
  useEffect(() => {
    load();

    const handleVisibilityChange = () => {
      if (!document.hidden) load();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [load]);
}
