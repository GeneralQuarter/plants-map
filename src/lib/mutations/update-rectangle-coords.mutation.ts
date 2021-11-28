import { PlainClientAPI } from 'contentful-management';
import { EntryProps, KeyValueMap } from 'contentful-management/types';
import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Rectangle } from '../../models/rectangle';
import { rectanglesWithCoordsQueryKey } from '../queries/rectangles-with-coords.query';

export function useUpdateRectangleCoordsMutation(cmaClient: PlainClientAPI) {
  const queryClient = useQueryClient();

  const updateRectangleCoords = useCallback(async ({ id, coords }: Rectangle) => {
    const entry = await cmaClient.entry.get({ entryId: id });

    const hasCoords = !!entry.fields.coords;

    const updatedEntry = await cmaClient.entry.patch(
      { entryId: id, version: entry.sys.version } as { entryId: string },
      [
        {
          op: hasCoords ? 'replace' : 'add',
          path: hasCoords ? '/fields/coords/fr' : '/fields/coords',
          value: hasCoords ? coords : { fr: coords }
        }
      ]
    );

    return cmaClient.entry.publish({ entryId: id }, updatedEntry);
  }, [cmaClient]);

  return useMutation<EntryProps<KeyValueMap>, Error, Rectangle, Rectangle[]>(updateRectangleCoords, {
    onMutate: async newRectangle => {
      await queryClient.cancelQueries(rectanglesWithCoordsQueryKey);

      const previousRectangles = queryClient.getQueryData<Rectangle[]>(rectanglesWithCoordsQueryKey);

      queryClient.setQueryData<Rectangle[]>(rectanglesWithCoordsQueryKey, (old = []) => {
        const rectangleIndex = old.findIndex(p => p.id === newRectangle.id);

        if (rectangleIndex === -1) {
          return [...old, newRectangle];
        }

        const newRectangles = [...old];
        newRectangles.splice(rectangleIndex, 1, newRectangle);
        return newRectangles;
      });

      return previousRectangles;
    },
    onError: (_err, _rectangle, context) => {
      queryClient.setQueryData<Rectangle[]>(rectanglesWithCoordsQueryKey, context ?? []);
    },
    onSettled: () => {
      queryClient.invalidateQueries(rectanglesWithCoordsQueryKey);
    }
  });
}