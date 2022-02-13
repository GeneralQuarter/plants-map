import { Autocomplete, Flex, GenericGroupType } from '@contentful/f36-components';
import { ContentfulClientApi, Entry } from 'contentful';
import { FC, useEffect, useState } from 'react';
import { PlantFields } from '../lib/contentful/plant-entry';
import { PlantCommonInfoFields } from '../lib/contentful/plant-common-info-entry';
import { queryEntries } from '../lib/contentful/query-entries';
import { RectangleFields } from '../lib/contentful/rectangle-entry';
import { ContentType } from '../lib/contentful/content-type';
import { MenuIcon, PlusIcon, PreviewIcon } from '@contentful/f36-icons';
import { useDebounce } from '../lib/use-debounce';

interface EntriesSearchProps {
  cdaClient: ContentfulClientApi;
  onEntryClick?: (entry: Entry<unknown>) => void;
}

type EntryGroupType<T> = GenericGroupType<Entry<T>>;
type GroupedEntries = EntryGroupType<unknown>[];

const contentTypeToGroupIndex: ContentType[] = [ContentType.Rectangle, ContentType.Plant, ContentType.PlantCard];

const entriesToGroupedEntries = (entries: Entry<unknown>[]): GroupedEntries => {
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
    const pA = (a as Entry<PlantFields>);
    const pB = (b as Entry<PlantFields>);

    return pA.fields.code.localeCompare(pB.fields.code);
  });

  return groups;
}

const renderItem = (entry: Entry<unknown>) => {
  const contentType = entry.sys.contentType.sys.id as ContentType;

  switch (contentType) {
    case ContentType.Plant:
      const plantEntry = (entry as Entry<PlantFields>);
      return <Flex alignItems="center" gap='spacingS'>
        {plantEntry.fields.position ? <PreviewIcon /> : <PlusIcon />}
        <span>{plantEntry.fields.code}</span>
      </Flex>;
    case ContentType.PlantCard:
      return <Flex alignItems="center" gap='spacingS'>
        <MenuIcon />
        <span>{(entry as Entry<PlantCommonInfoFields>).fields.fullLatinName}</span>
      </Flex>
    case ContentType.Rectangle:
      const plantRectangleEntry = (entry as Entry<RectangleFields>);
      return <Flex alignItems="center" gap='spacingS'>
        {plantRectangleEntry.fields.coords ? <PreviewIcon /> : <PlusIcon />}
        <span>{plantRectangleEntry.fields.label}</span>
      </Flex>;
    default:
      return <span></span>;
  }
}

const itemToString = (entry: Entry<unknown>) => {
  const contentType = entry.sys.contentType.sys.id as ContentType;

  switch (contentType) {
    case ContentType.Plant:
      return (entry as Entry<PlantFields>).fields.code;
    case ContentType.PlantCard:
      return (entry as Entry<PlantCommonInfoFields>).fields.fullLatinName;
    case ContentType.Rectangle:
      return (entry as Entry<RectangleFields>).fields.label;
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

  return <Autocomplete<Entry<unknown>>
    isGrouped 
    items={items} 
    itemToString={itemToString}
    renderItem={renderItem}
    onSelectItem={(entry: Entry<unknown>) => onEntryClick?.(entry)}
    onInputValueChange={setInputValue}
    listWidth={'full'}
    listMaxHeight={360}
    isLoading={isLoading}
    clearAfterSelect
  />;
}

export default EntriesSearch;