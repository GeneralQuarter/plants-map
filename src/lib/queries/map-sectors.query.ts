import { useQuery } from '@tanstack/react-query';
import type { ContentfulClientApi } from 'contentful';
import { useCallback } from 'react';
import type { MapSector } from '../../models/map-sector';
import { getMapSectors } from '../contentful/get-map-sectors';

export const mapSectorsQueryKey = 'mapSectors';

export function useMapSectors(cdaClient: ContentfulClientApi<undefined>) {
  const fetchMapSectors = useCallback(
    async () => (await getMapSectors(cdaClient)).items,
    [cdaClient],
  );

  return useQuery<MapSector[]>({
    queryKey: [mapSectorsQueryKey],
    queryFn: fetchMapSectors,
    refetchOnWindowFocus: false,
  });
}
