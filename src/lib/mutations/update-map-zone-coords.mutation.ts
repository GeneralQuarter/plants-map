import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PlainClientAPI } from 'contentful-management';
import type { EntryProps, KeyValueMap } from 'contentful-management/types';
import { useCallback } from 'react';
import type { MapZone } from '../../models/map-zone';
import { mapZonesWithCoordsQueryKey } from '../queries/map-zones-with-coords.query';

export function useUpdateMapZoneCoordsMutation(cmaClient: PlainClientAPI) {
  const queryClient = useQueryClient();

  const updateMapZoneCoords = useCallback(
    async ({ id, coords, orientation }: MapZone) => {
      const entry = await cmaClient.entry.get({ entryId: id });

      const hasCoords = !!entry.fields.coords;

      const updatedEntry = await cmaClient.entry.patch(
        { entryId: id, version: entry.sys.version } as { entryId: string },
        [
          {
            op: hasCoords ? 'replace' : 'add',
            path: hasCoords ? '/fields/coords/fr' : '/fields/coords',
            value: hasCoords ? coords : { fr: coords },
          },
          {
            op: 'replace',
            path: '/fields/orientation/fr',
            value: orientation,
          },
        ],
      );

      return cmaClient.entry.publish({ entryId: id }, updatedEntry);
    },
    [cmaClient],
  );

  return useMutation<EntryProps<KeyValueMap>, Error, MapZone, MapZone[]>({
    mutationFn: updateMapZoneCoords,
    onMutate: async (newMapZone) => {
      await queryClient.cancelQueries({
        queryKey: [mapZonesWithCoordsQueryKey],
      });

      const previousMapZones = queryClient.getQueryData<MapZone[]>([
        mapZonesWithCoordsQueryKey,
      ]);

      queryClient.setQueryData<MapZone[]>(
        [mapZonesWithCoordsQueryKey],
        (old = []) => {
          const mapZoneIndex = old.findIndex((p) => p.id === newMapZone.id);

          if (mapZoneIndex === -1) {
            return [...old, newMapZone];
          }

          const newMapZones = [...old];
          newMapZones.splice(mapZoneIndex, 1, newMapZone);
          return newMapZones;
        },
      );

      return previousMapZones;
    },
    onError: (_err, _rectangle, context) => {
      queryClient.setQueryData<MapZone[]>(
        [mapZonesWithCoordsQueryKey],
        context ?? [],
      );
    },
  });
}
