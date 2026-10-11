import { useCallback, useState } from 'react';
import { societiesService } from '../../../services';
import { useLoadOnVisible } from '../utils/useLoadOnVisible';
import { institutionProfileCopy as copy } from './institutionProfile.copy';

// The students who chose this society when they signed up.
// The society is identified by its token, so no id is passed.
// total stays null until a request succeeds, so the header can show a dash
// rather than claim the society has no members when the request merely failed.
// onError receives a message to show; pass a stable function such as showToast.
export function useSocietyMembers(onError) {
  const [members, setMembers] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMembers = useCallback(async () => {
    try {
      const data = await societiesService.getOwnMembers();
      setMembers(data);
      setTotal(data.length);
    } catch (error) {
      console.error('Error fetching society members:', error);
      onError?.(copy.errors.loadMembers);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useLoadOnVisible(loadMembers);

  return { members, total, loading };
}
