import { ContentfulClientApi } from 'contentful';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { Hedge } from '../../models/hedge';
import { getHedges } from '../contentful/get-hedges';

export const hedgesQueryKey = 'hedges';

export function useHedges(cdaClient: ContentfulClientApi<undefined>) {
  const fetchHedges = useCallback(async () => {
    const res = await getHedges(cdaClient);
    return res.items;
  }, [cdaClient]);

  return useQuery<Hedge[]>(hedgesQueryKey, fetchHedges, {refetchOnWindowFocus: false});
}
