import { useCallback, useState } from 'react';
import { resourcesService } from '../../../services';
import { useLoadOnVisible } from '../utils/useLoadOnVisible';
import { SOCIETY_RESOURCES_LIMIT } from './institutionOptions';
import { institutionProfileCopy as copy } from './institutionProfile.copy';

// Resources uploaded for society accounts.
// total is the full count, which can be higher than the number of resources loaded.
// It stays null until a request succeeds.
// onError receives a message to show; pass a stable function such as showToast.
export function useSocietyResources(onError) {
  const [resources, setResources] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadResources = useCallback(async () => {
    try {
      const data = await resourcesService.getResources({ audience: 'society', limit: SOCIETY_RESOURCES_LIMIT });
      setResources(data.resources);
      setTotal(data.pagination?.totalCount ?? data.resources.length);
    } catch (error) {
      console.error('Error fetching society resources:', error);
      onError?.(copy.errors.loadResources);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useLoadOnVisible(loadResources);

  return { resources, total, loading };
}
