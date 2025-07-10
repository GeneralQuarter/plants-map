import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PlainClientAPI } from 'contentful-management';
import type { EntryProps, KeyValueMap } from 'contentful-management/types';
import { useCallback } from 'react';
import type { Plant } from '../../models/plant';
import { plantsWithPositionQueryKey } from '../queries/plants-with-position.query';
import { upsertPlantTag } from '../update-tag-on-plant';

interface Variables {
  plantId: string;
  date: Date;
}

export function usePlantPlantMutation(cmaClient: PlainClientAPI) {
  const queryClient = useQueryClient();

  const plantPlant = useCallback(
    async ({ plantId, date }: Variables) => {
      const entry = await cmaClient.entry.get({ entryId: plantId });

      const plantedTag = {
        sys: {
          id: 'planted',
          linkType: 'Tag',
          type: 'Link',
        },
      };

      const plantedAt = date.toISOString();

      const updatedEntry = await cmaClient.entry.patch(
        { entryId: plantId, version: entry.sys.version } as { entryId: string },
        [
          {
            op: 'add',
            path: '/metadata/tags/-',
            value: plantedTag,
          },
          {
            op: entry.fields.plantedAt ? 'replace' : 'add',
            path: entry.fields.plantedAt
              ? '/fields/plantedAt/fr'
              : '/fields/plantedAt',
            value: entry.fields.plantedAt ? plantedAt : { fr: plantedAt },
          },
        ],
      );

      return cmaClient.entry.publish({ entryId: plantId }, updatedEntry);
    },
    [cmaClient],
  );

  return useMutation<EntryProps<KeyValueMap>, Error, Variables, Plant[]>({
    mutationFn: plantPlant,
    onMutate: ({ plantId }: Variables) => {
      const beforeMutationPlants = queryClient.getQueryData<Plant[]>([
        plantsWithPositionQueryKey,
      ]);

      queryClient.setQueryData<Plant[]>(
        [plantsWithPositionQueryKey],
        (old = []) => upsertPlantTag(old, plantId, 'planted'),
      );

      return beforeMutationPlants;
    },
    onError: (
      _err: Error,
      _variables: Variables,
      plants: Plant[] | undefined,
    ) => {
      queryClient.setQueryData<Plant[]>(
        [plantsWithPositionQueryKey],
        plants ?? [],
      );
    },
  });
}
