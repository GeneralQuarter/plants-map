import { ContentfulClientApi } from 'contentful';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { getMapZonesWithCoords } from '../contentful/get-map-zones-with-coords';
import { MapZone } from '../../models/map-zone';

export const mapZonesWithCoordsQueryKey = 'map-zones-with-coords';

export function useMapZonesWithCoordsQuery(cdaClient: ContentfulClientApi<undefined>) {
  const fetchMapZonesWithCoords = useCallback(async () => {
    const res = await getMapZonesWithCoords(cdaClient);
    return res.items;
  }, [cdaClient]);

  return useQuery<MapZone[]>(mapZonesWithCoordsQueryKey, fetchMapZonesWithCoords, {refetchOnWindowFocus: false});
}
