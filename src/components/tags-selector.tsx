import { Autocomplete, Collapse, Stack } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import styled from '@emotion/styled';
import { FC, useMemo, useState } from 'react';
import { SelectedTag } from '../models/selected-tag';
import { Tags } from '../models/tags';
import ColoredPill from './colored-pill';

const WrapStack = styled(Stack)`
  flex-wrap: wrap;
  gap: ${tokens.spacingS} !important;
`;

interface TagsSelectorProps {
  tags: Tags;
  selectedTags: SelectedTag[];
  toggleTag: (tagId: string) => void;
}

const TagsSelector: FC<TagsSelectorProps> = ({ tags, selectedTags, toggleTag }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const tagList = useMemo(() => {
    return Object.entries(tags)
      .map(([k, v]) => ({id: k, label: v}))
      .filter(t => {
        const isNotSelected = !selectedTags.some(st => st.id === t.id);

        return inputValue ? isNotSelected && t.label.toLowerCase().includes(inputValue.toLowerCase()) : isNotSelected;
      })
      .sort((a, b) => -b.label.localeCompare(a.label));
  }, [tags, selectedTags, inputValue]);

  const selectedTagList = useMemo(() => {
    return selectedTags
      .map(({ id, hueIndex }) => ({ id, label: tags[id], hueIndex }))
  }, [tags, selectedTags]);

  return <>
    <Autocomplete 
        items={tagList}
        onInputValueChange={setInputValue}
        clearAfterSelect
        onSelectItem={item => toggleTag(item.id)}
        itemToString={t => t.label}
        renderItem={t => t.label}
        listWidth={'full'}
        listMaxHeight={360}
        placeholder="Tags"
      />
    <Collapse isExpanded={selectedTagList.length > 0}>
      <WrapStack>
        {selectedTagList.map(st => (
          <ColoredPill 
            key={st.id} 
            label={st.label} 
            onClose={() => toggleTag(st.id)} 
            // @ts-ignore
            hueIndex={st.hueIndex} 
          />
        ))}
      </WrapStack>
    </Collapse>
  </>;
}

export default TagsSelector;