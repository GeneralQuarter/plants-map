import { PlainClientAPI } from 'contentful-management';
import { EntryProps, KeyValueMap } from 'contentful-management/types';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Plant } from '../../models/plant';
import { plantsWithPositionQueryKey } from '../queries/plants-with-position.query';

export function usePinPlantMutation(cmaClient: PlainClientAPI) {
  const queryClient = useQueryClient();

  const pinPlant = useCallback(async (plantId: string) => {
    const entry = await cmaClient.entry.get({ entryId: plantId });

    const pinTag = {
      sys: {
        id: 'jalonne',
        linkType: 'Tag',
        type: 'Link'
      }
    }

    const updatedEntry = await cmaClient.entry.patch(
      { entryId: plantId, version: entry.sys.version } as { entryId: string },
      [
        {
          op: 'add',
          path: '/metadata/tags/-',
          value: pinTag
        }
      ]
    );

    return cmaClient.entry.publish({ entryId: plantId }, updatedEntry);
  }, [cmaClient]);

  return useMutation<EntryProps<KeyValueMap>, Error, string, Plant[]>(pinPlant, {
    onSuccess: (_data, plantId) => {
      queryClient.setQueryData<Plant[]>(plantsWithPositionQueryKey, (old = []) => {
        const oldPlantIndex = old.findIndex(p => p.id === plantId);

        if (oldPlantIndex === -1) {
          return old;
        }

        const oldPlant = old[oldPlantIndex];

        if (!oldPlant || oldPlant.tags.includes('jalonne')) {
          return old;
        }
        
        const newTags = [...oldPlant.tags, 'jalonne'];
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