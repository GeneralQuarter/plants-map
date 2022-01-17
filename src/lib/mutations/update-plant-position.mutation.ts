import { PlainClientAPI } from 'contentful-management';
import { EntryProps, KeyValueMap } from 'contentful-management/types';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Plant } from '../../models/plant';
import { plantsWithPositionQueryKey } from '../queries/plants-with-position.query';

export function useUpdatePlantMutation(cmaClient: PlainClientAPI) {
  const queryClient = useQueryClient();

  const updatePlantPosition = useCallback(async ({ id, position }: Plant) => {
    const entry = await cmaClient.entry.get({ entryId: id });

    if (!position) {
      throw new Error('Can\'t update plant position, it\'s not defined');
    }

    const newPosition = {
      lat: position[0],
      lon: position[1]
    };

    const updatedEntry = await cmaClient.entry.patch(
      { entryId: id, version: entry.sys.version } as { entryId: string },
      [
        {
          op: entry.fields.position ? 'replace' : 'add',
          path: entry.fields.position ? '/fields/position/fr' : '/fields/position',
          value: entry.fields.position ? newPosition : { fr: newPosition }
        }
      ]
    );

    return cmaClient.entry.publish({ entryId: id }, updatedEntry);
  }, [cmaClient]);

  return useMutation<EntryProps<KeyValueMap>, Error, Plant, Plant[]>(updatePlantPosition, {
    onMutate: async newPlant => {
      await queryClient.cancelQueries(plantsWithPositionQueryKey);

      const previousPlants = queryClient.getQueryData<Plant[]>(plantsWithPositionQueryKey);

      queryClient.setQueryData<Plant[]>(plantsWithPositionQueryKey, (old = []) => {
        const plantIndex = old.findIndex(p => p.id === newPlant.id);

        if (plantIndex === -1) {
          return [...old, newPlant];
        }

        const newPlants = [...old];
        newPlants.splice(plantIndex, 1, newPlant);
        return newPlants;
      })

      return previousPlants;
    },
    onError: (_err, _plant, context) => {
      queryClient.setQueryData<Plant[]>(plantsWithPositionQueryKey, context ?? []);
    },
    onSettled: () => {
      queryClient.invalidateQueries(plantsWithPositionQueryKey);
    }
  });
}