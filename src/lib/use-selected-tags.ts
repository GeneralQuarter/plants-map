import { useCallback, useState } from 'react';
import { HUE_FRACTIONS } from '../data/colors';
import type { SelectedTag } from '../models/selected-tag';

type UseSelectedTags = [
  selectedTags: SelectedTag[],
  toggleTag: (tagId: string) => void,
];

export function useSelectedTags(): UseSelectedTags {
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);

  const getNextHueIndex = useCallback(() => {
    const hueIndexes = Array(HUE_FRACTIONS)
      .fill(null)
      .map((_, i) => (selectedTags.some((t) => t.hueIndex === i) ? null : i))
      .filter((n) => n !== null);

    if (hueIndexes.length === 0) {
      return null;
    }

    return hueIndexes[Math.floor(Math.random() * hueIndexes.length)];
  }, [selectedTags]);

  const toggleTag = useCallback(
    (tagId: string) => {
      const index = selectedTags.findIndex((t) => t.id === tagId);
      const newSelectedTags = [...selectedTags];

      if (index === -1) {
        const hueIndex = getNextHueIndex();

        if (hueIndex === null) {
          return;
        }

        newSelectedTags.push({
          id: tagId,
          hueIndex,
        });
      } else {
        newSelectedTags.splice(index, 1);
      }

      setSelectedTags(newSelectedTags);
    },
    [selectedTags, getNextHueIndex],
  );

  return [selectedTags, toggleTag];
}
