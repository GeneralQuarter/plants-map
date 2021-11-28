import { ContentfulClientApi } from 'contentful';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { Plant } from '../../models/plant';
import { getPlantsWithPosition } from '../contentful/get-plants-with-position';

export const plantsWithPositionQueryKey = 'plants-with-position';

export function usePlantsWithPositionQuery(cdaClient: ContentfulClientApi) {
  const fetchPlantsWithPosition = useCallback(async () => {
    const res = await getPlantsWithPosition(cdaClient);
    return res.items;
  }, [cdaClient]);

  return useQuery<Plant[]>(plantsWithPositionQueryKey, fetchPlantsWithPosition, {refetchOnWindowFocus: false});
}