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

export function useDeadPlantMutation(cmaClient: PlainClientAPI) {
  const queryClient = useQueryClient();

  const deadPlant = useCallback(async ({plantId, date}: Variables) => {
    const entry = await cmaClient.entry.get({ entryId: plantId });

    const deadTag = {
      sys: {
        id: 'dead',
        linkType: 'Tag',
        type: 'Link'
      }
    }

    const declaredDeadAt = date.toISOString();

    const updatedEntry = await cmaClient.entry.patch(
      { entryId: plantId, version: entry.sys.version } as { entryId: string },
      [
        {
          op: 'add',
          path: '/metadata/tags/-',
          value: deadTag
        },
        {
          op: entry.fields.declaredDeadAt ? 'replace' : 'add',
          path: entry.fields.declaredDeadAt ? '/fields/declaredDeadAt/fr' : '/fields/declaredDeadAt',
          value: entry.fields.declaredDeadAt ? declaredDeadAt : { fr: declaredDeadAt }
        }
      ]
    );

    return cmaClient.entry.publish({ entryId: plantId }, updatedEntry);
  }, [cmaClient]);

  return useMutation<EntryProps<KeyValueMap>, Error, Variables, Plant[]>(deadPlant, {
    onMutate: ({plantId}: Variables) => {
      const beforeMutationPlants = queryClient.getQueryData<Plant[]>(plantsWithPositionQueryKey);

      queryClient.setQueryData<Plant[]>(plantsWithPositionQueryKey, (old = []) => upsertPlantTag(old, plantId, 'dead'));

      return beforeMutationPlants;
    },
    onError: (err: Error, {plantId}: Variables, plants: Plant[] | undefined) => {
      queryClient.setQueryData<Plant[]>(plantsWithPositionQueryKey, plants ?? []);
    }
  });
}
