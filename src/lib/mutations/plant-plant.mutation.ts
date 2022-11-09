import { PlainClientAPI } from 'contentful-management';
import { EntryProps, KeyValueMap } from 'contentful-management/types';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Plant } from '../../models/plant';
import { plantsWithPositionQueryKey } from '../queries/plants-with-position.query';
import { upsertPlantTag } from '../update-tag-on-plant';

interface Variables {
  plantId: string;
  date: Date;
}

export function usePlantPlantMutation(cmaClient: PlainClientAPI) {
  const queryClient = useQueryClient();

  const plantPlant = useCallback(async ({plantId, date}: Variables) => {
    const entry = await cmaClient.entry.get({ entryId: plantId });

    const plantedTag = {
      sys: {
        id: 'planted',
        linkType: 'Tag',
        type: 'Link'
      }
    }

    const actions = {
      [date.toISOString()]: 'PLANTED'
    };

    const updatedEntry = await cmaClient.entry.patch(
      { entryId: plantId, version: entry.sys.version } as { entryId: string },
      [
        {
          op: 'add',
          path: '/metadata/tags/-',
          value: plantedTag
        },
        {
          op: 'add',
          path: '/fields/actions',
          value: { fr: actions }
        }
      ]
    );

    return cmaClient.entry.publish({ entryId: plantId }, updatedEntry);
  }, [cmaClient]);

  return useMutation<EntryProps<KeyValueMap>, Error, Variables, Plant[]>(plantPlant, {
    onMutate: ({plantId}: Variables) => {
      const beforeMutationPlants = queryClient.getQueryData<Plant[]>(plantsWithPositionQueryKey);

      queryClient.setQueryData<Plant[]>(plantsWithPositionQueryKey, (old = []) => upsertPlantTag(old, plantId, 'planted'));

      return beforeMutationPlants;
    },
    onError: (err: Error, {plantId}: Variables, plants: Plant[] | undefined) => {
      queryClient.setQueryData<Plant[]>(plantsWithPositionQueryKey, plants ?? []);
    }
  });
}