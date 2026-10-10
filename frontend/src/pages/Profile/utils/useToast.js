import { useCallback, useState } from 'react';

// Holds one toast message at a time. Render it with the Toast component.
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'error') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast };
}
