import { Autocomplete, Collapse, Flex, Stack, Switch } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import styled from '@emotion/styled';
import { FC, useMemo, useState } from 'react';
import { SelectedTag } from '../models/selected-tag';
import { Tags } from '../models/tags';
import ColoredPill from './colored-pill';

const Container = styled(Flex)`
  position: absolute;
  z-index: 1000;
  left: 0;
  width: 280px;
  background-color: ${tokens.gray100};
  top: 70px;
  border-bottom-right-radius: 4px;
  box-shadow: ${tokens.boxShadowPositive};
`;

const Header = styled(Flex)`
  padding: ${tokens.spacingM};
`;

const WrapStack = styled(Stack)`
  flex-wrap: wrap;
  gap: ${tokens.spacingS} !important;
`;

interface TagsAsideProps {
  tags: Tags;
  selectedTags: SelectedTag[];
  toggleTag: (tagId: string) => void;
  showOutlines: boolean;
  setShowOutlines: (showOutlines: boolean) => void;
}

const TagsAside: FC<TagsAsideProps> = ({ tags, selectedTags, toggleTag, showOutlines, setShowOutlines }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const tagList = useMemo(() => {
    return Object.entries(tags)
      .map(([k, v]) => ({id: k, label: v}))
      .filter(t => {
        const isNotselected = !selectedTags.some(st => st.id === t.id);

        return inputValue ? isNotselected && t.label.toLowerCase().includes(inputValue.toLowerCase()) : isNotselected;
      })
      .sort((a, b) => -b.label.localeCompare(a.label));
  }, [tags, selectedTags, inputValue]);

  const selectedTagList = useMemo(() => {
    return selectedTags
      .map(({ id, hueIndex }) => ({ id, label: tags[id], hueIndex }))
  }, [tags, selectedTags]);

  return <Container flexDirection="column">
    <Header alignItems="flex-start" flexDirection="column" gap="spacingM">
      <Switch isChecked={showOutlines} onChange={() => setShowOutlines(!showOutlines)}>
        Show non pinned plants
      </Switch>
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
    </Header>
    <Collapse isExpanded={selectedTagList.length > 0}>
      <WrapStack padding="spacingM" paddingTop="none">
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
  </Container>;
}

export default TagsAside;