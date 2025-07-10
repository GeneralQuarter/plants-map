import { useQuery } from '@tanstack/react-query';
import type { ContentfulClientApi } from 'contentful';
import { useCallback } from 'react';
import type { MapZone } from '../../models/map-zone';
import { getMapZonesWithCoords } from '../contentful/get-map-zones-with-coords';

export const mapZonesWithCoordsQueryKey = 'map-zones-with-coords';

export function useMapZonesWithCoordsQuery(
  cdaClient: ContentfulClientApi<undefined>,
) {
  const fetchMapZonesWithCoords = useCallback(async () => {
    const res = await getMapZonesWithCoords(cdaClient);
    return res.items;
  }, [cdaClient]);

  // mapZonesWithCoordsQueryKey, fetchMapZonesWithCoords, {refetchOnWindowFocus: false}
  return useQuery<MapZone[]>({
    queryKey: [mapZonesWithCoordsQueryKey],
    queryFn: fetchMapZonesWithCoords,
    refetchOnWindowFocus: false,
  });
}
