import { Autocomplete, Flex } from '@contentful/f36-components';
import { ContentfulClientApi, Entry, EntrySkeletonType } from 'contentful';
import { FC, useEffect, useState } from 'react';
import { queryEntries } from '../lib/contentful/query-entries';
import { ContentType } from '../lib/contentful/content-type';
import { MenuIcon, PlusIcon, PreviewIcon } from '@contentful/f36-icons';
import { useDebounce } from '../lib/use-debounce';
import type { PlantEntry } from '../lib/contentful/plant.entry-skeleton';
import type { PlantCommonInfoEntry } from '../lib/contentful/plant-common-info.entry-skeleton';
import type { RectangleEntry } from '../lib/contentful/rectangle.entry-skeleton';
import type { HedgeEntry } from '../lib/contentful/hedge.entry-skeleton';
import type { MapZoneEntry } from '../lib/contentful/map-zone.entry-skeleton';

interface EntriesSearchProps {
  cdaClient: ContentfulClientApi<undefined>;
  onEntryClick?: (entry: Entry<any>) => void;
}

interface GenericGroupType<T> {
  groupTitle: string;
  options: T[];
}

type EntryGroupType<T extends EntrySkeletonType> = GenericGroupType<Entry<T, 'WITHOUT_UNRESOLVABLE_LINKS', 'fr'>>;
type GroupedEntries = EntryGroupType<any>[];

const contentTypeToGroupIndex: ContentType[] = [ContentType.Rectangle, ContentType.Plant, ContentType.PlantCard, ContentType.Hedge, ContentType.MapZone];

const entriesToGroupedEntries = (entries: Entry<any, 'WITHOUT_UNRESOLVABLE_LINKS', 'fr'>[]): GroupedEntries => {
  const groups: GroupedEntries = [
    {
      groupTitle: 'Rectangles',
      options: []
    },
    {
      groupTitle: 'Plants',
      options: []
    },
    {
      groupTitle: 'Plant Cards',
      options: []
    },
    {
      groupTitle: 'Hedges',
      options: []
    },
    {
      groupTitle: 'Zones',
      options: []
    }
  ]

  for (const entry of entries) {
    const groupIndex = contentTypeToGroupIndex.indexOf(entry.sys.contentType.sys.id as ContentType);

    if (groupIndex === -1) {
      continue;
    }

    groups[groupIndex].options.push(entry);
  }

  const plantGroupIndex = contentTypeToGroupIndex.indexOf(ContentType.Plant);

  groups[plantGroupIndex].options.sort((a, b) => {
    const pA = (a as PlantEntry);
    const pB = (b as PlantEntry);

    return pA.fields.code.localeCompare(pB.fields.code);
  });

  return groups;
}

const renderItem = (entry: Entry<any, 'WITHOUT_UNRESOLVABLE_LINKS', 'fr'>) => {
  const contentType = entry.sys.contentType.sys.id as ContentType;

  switch (contentType) {
    case ContentType.Plant:
      const plantEntry = (entry as PlantEntry);
      return <Flex alignItems="center" gap='spacingS'>
        {plantEntry.fields.position ? <PreviewIcon /> : <PlusIcon />}
        <span>{plantEntry.fields.code}</span>
      </Flex>;
    case ContentType.PlantCard:
      return <Flex alignItems="center" gap='spacingS'>
        <MenuIcon />
        <span>{(entry as PlantCommonInfoEntry).fields.fullLatinName}</span>
      </Flex>
    case ContentType.Rectangle:
      const plantRectangleEntry = (entry as RectangleEntry);
      return <Flex alignItems="center" gap='spacingS'>
        {plantRectangleEntry.fields.coords ? <PreviewIcon /> : <PlusIcon />}
        <span>{plantRectangleEntry.fields.label}</span>
      </Flex>;
    case ContentType.Hedge:
      return <Flex alignItems="center" gap='spacingS'>
        <PreviewIcon />
        <span>{(entry as HedgeEntry).fields.name}</span>
      </Flex>
    case ContentType.MapZone:
      const mapZoneEntry = (entry as MapZoneEntry);
      return <Flex alignItems="center" gap='spacingS'>
        {mapZoneEntry.fields.coords ? <PreviewIcon /> : <PlusIcon />}
        <span>{mapZoneEntry.fields.name}</span>
      </Flex>
    default:
      return <span></span>;
  }
}

const itemToString = (entry: Entry<any, 'WITHOUT_UNRESOLVABLE_LINKS', 'fr'>) => {
  const contentType = entry.sys.contentType.sys.id as ContentType;

  switch (contentType) {
    case ContentType.Plant:
      return (entry as PlantEntry).fields.code;
    case ContentType.PlantCard:
      return (entry as PlantCommonInfoEntry).fields.fullLatinName;
    case ContentType.Rectangle:
      return (entry as RectangleEntry).fields.label;
    case ContentType.Hedge:
        return (entry as HedgeEntry).fields.name;
    default:
      return '';
  }
}

const EntriesSearch: FC<EntriesSearchProps> = ({ cdaClient, onEntryClick }) => {
  const [items, setItems] = useState<GroupedEntries>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debouncedInputValue = useDebounce(inputValue);

  useEffect(() => {
    (async () => {
      if (debouncedInputValue.length < 2) {
        setItems([]);
        return;
      }

      setIsLoading(true);

      try {
        const result = await queryEntries(cdaClient, debouncedInputValue);
        setItems(entriesToGroupedEntries(result.items));
      } catch (e) {}

      setIsLoading(false);
    })();
  }, [cdaClient, debouncedInputValue]);

  return <Autocomplete<Entry<any, 'WITHOUT_UNRESOLVABLE_LINKS', 'fr'>>
    isGrouped 
    items={items} 
    itemToString={itemToString}
    renderItem={renderItem}
    onSelectItem={(entry: Entry<any, 'WITHOUT_UNRESOLVABLE_LINKS', 'fr'>) => onEntryClick?.(entry)}
    onInputValueChange={setInputValue}
    listWidth={'full'}
    listMaxHeight={360}
    isLoading={isLoading}
    clearAfterSelect
  />;
}

export default EntriesSearch;
