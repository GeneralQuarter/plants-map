import { PlainClientAPI } from 'contentful-management';
import { EntryProps, KeyValueMap } from 'contentful-management/types';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Plant } from '../../models/plant';
import { plantsWithPositionQueryKey } from '../queries/plants-with-position.query';

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
    onSuccess: (_data, {plantId}: Variables) => {
      queryClient.setQueryData<Plant[]>(plantsWithPositionQueryKey, (old = []) => {
        const oldPlantIndex = old.findIndex(p => p.id === plantId);

        if (oldPlantIndex === -1) {
          return old;
        }

        const oldPlant = old[oldPlantIndex];

        if (!oldPlant || oldPlant.tags.includes('planted')) {
          return old;
        }
        
        const newTags = [...oldPlant.tags, 'planted'];
        const newPlant = {...oldPlant, tags: newTags};
        const newPlants = [...old];
        newPlants.splice(oldPlantIndex, 1, newPlant);
        return newPlants;
      });
    },
    onError: () => {
      queryClient.invalidateQueries(plantsWithPositionQueryKey);
    }
  });
}