import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  EntryProps,
  KeyValueMap,
  PlainClientAPI,
} from 'contentful-management';
import { useCallback } from 'react';
import type { MapSector } from '../../models/map-sector';
import { mapSectorsQueryKey } from '../queries/map-sectors.query';

export function useUpdateMapSectorGeoJSONMutation(cmaClient: PlainClientAPI) {
  const queryClient = useQueryClient();

  const updateMapSectorGeoJSON = useCallback(
    async ({ id, geojson }: MapSector) => {
      const entry = await cmaClient.entry.get({ entryId: id });

      const updatedEntry = await cmaClient.entry.patch(
        { entryId: id, version: entry.sys.version } as { entryId: string },
        [
          {
            op: 'replace',
            path: '/fields/geojson/fr',
            value: geojson,
          },
        ],
      );

      return cmaClient.entry.publish({ entryId: id }, updatedEntry);
    },
    [cmaClient],
  );

  return useMutation<EntryProps<KeyValueMap>, Error, MapSector, MapSector[]>({
    mutationFn: updateMapSectorGeoJSON,
    onMutate: async (newMapSector) => {
      await queryClient.cancelQueries({
        queryKey: [mapSectorsQueryKey],
      });

      const previousMapSectors = queryClient.getQueryData<MapSector[]>([
        mapSectorsQueryKey,
      ]);

      queryClient.setQueryData<MapSector[]>(
        [mapSectorsQueryKey],
        (old = []) => {
          const mapSectorIndex = old.findIndex((p) => p.id === newMapSector.id);

          if (mapSectorIndex === -1) {
            return [...old, newMapSector];
          }

          const newMapSectors = [...old];
          newMapSectors.splice(mapSectorIndex, 1, newMapSector);
          return newMapSectors;
        },
      );

      return previousMapSectors;
    },
    onError: (_err, _mqpSector, context) => {
      queryClient.setQueryData<MapSector[]>(
        [mapSectorsQueryKey],
        context ?? [],
      );
    },
  });
}
