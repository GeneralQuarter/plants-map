import { useQuery } from '@tanstack/react-query';
import type { ContentfulClientApi } from 'contentful';
import { useCallback } from 'react';
import type { Hedge } from '../../models/hedge';
import { getHedges } from '../contentful/get-hedges';

export const hedgesQueryKey = 'hedges';

export function useHedges(cdaClient: ContentfulClientApi<undefined>) {
  const fetchHedges = useCallback(async () => {
    const res = await getHedges(cdaClient);
    return res.items;
  }, [cdaClient]);

  return useQuery<Hedge[]>({
    queryKey: [hedgesQueryKey],
    queryFn: fetchHedges,
    refetchOnWindowFocus: false,
  });
}
