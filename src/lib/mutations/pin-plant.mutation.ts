import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PlainClientAPI } from 'contentful-management';
import type { EntryProps, KeyValueMap } from 'contentful-management/types';
import { useCallback } from 'react';
import type { Plant } from '../../models/plant';
import { plantsWithPositionQueryKey } from '../queries/plants-with-position.query';
import { upsertPlantTag } from '../update-tag-on-plant';

export function usePinPlantMutation(cmaClient: PlainClientAPI) {
  const queryClient = useQueryClient();

  const pinPlant = useCallback(
    async (plantId: string) => {
      const entry = await cmaClient.entry.get({ entryId: plantId });

      const pinTag = {
        sys: {
          id: 'jalonne',
          linkType: 'Tag',
          type: 'Link',
        },
      };

      const updatedEntry = await cmaClient.entry.patch(
        { entryId: plantId, version: entry.sys.version } as { entryId: string },
        [
          {
            op: 'add',
            path: '/metadata/tags/-',
            value: pinTag,
          },
        ],
      );

      return cmaClient.entry.publish({ entryId: plantId }, updatedEntry);
    },
    [cmaClient],
  );

  return useMutation<EntryProps<KeyValueMap>, Error, string, Plant[]>({
    mutationFn: pinPlant,
    onMutate: (plantId: string) => {
      const beforeMutationPlants = queryClient.getQueryData<Plant[]>([
        plantsWithPositionQueryKey,
      ]);

      queryClient.setQueryData<Plant[]>(
        [plantsWithPositionQueryKey],
        (old = []) => upsertPlantTag(old, plantId, 'jalonne'),
      );

      return beforeMutationPlants;
    },
    onError: (_err: Error, _plantId: string, plants: Plant[] | undefined) => {
      queryClient.setQueryData<Plant[]>(
        [plantsWithPositionQueryKey],
        plants ?? [],
      );
    },
  });
}
