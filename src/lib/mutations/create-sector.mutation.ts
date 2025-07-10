import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PlainClientAPI } from 'contentful-management';
import type { EntryProps, KeyValueMap } from 'contentful-management/types';
import type { Feature, Polygon } from 'geojson';
import { useCallback } from 'react';
import { v4 } from 'uuid';
import type { MapSector } from '../../models/map-sector';
import { mapSectorsQueryKey } from '../queries/map-sectors.query';

interface Variables {
  geojson: Feature<Polygon>;
}

export function useCreateSectorMutation(cmaClient: PlainClientAPI) {
  const queryClient = useQueryClient();

  const createSector = useCallback(
    async ({ geojson }: Variables) => {
      const entry = await cmaClient.entry.create(
        { contentTypeId: 'mapSector' },
        {
          fields: {
            geojson: { fr: geojson },
            name: { fr: v4() },
          },
        },
      );

      return cmaClient.entry.publish({ entryId: entry.sys.id }, entry);
    },
    [cmaClient],
  );

  return useMutation<EntryProps<KeyValueMap>, Error, Variables, MapSector[]>({
    mutationFn: createSector,
    onSuccess: async (newEntry) => {
      const newMapSector = {
        id: newEntry.sys.id,
        name: newEntry.fields.name,
        geojson: newEntry.fields.geojson,
      };

      queryClient.setQueryData<MapSector[]>(
        [mapSectorsQueryKey],
        (old = []) => [...old, newMapSector],
      );
    },
  });
}
