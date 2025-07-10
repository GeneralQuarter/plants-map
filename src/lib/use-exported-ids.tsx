import { useCallback, useState } from 'react';

type UseExportedIds = [
  ids: string[],
  toggleId: (id: string) => void,
  clear: () => void,
];

export function useExportedIds(): UseExportedIds {
  const [ids, setIds] = useState<string[]>([]);

  const toggleId = useCallback(
    (id: string) => {
      const index = ids.findIndex((i) => i === id);
      const newExportedIds = [...ids];

      if (index === -1) {
        newExportedIds.push(id);
      } else {
        newExportedIds.splice(index, 1);
      }

      setIds(newExportedIds);
    },
    [ids],
  );

  const clear = () => {
    setIds([]);
  };

  return [ids, toggleId, clear];
}
