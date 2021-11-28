import { 
  Flex, 
  Subheading, 
  IconButton, 
  Box, 
  Button, 
  Paragraph, 
  SectionHeading, 
  Text, 
  Stack, 
  Pill, 
  List, 
  TextLink, 
  SkeletonContainer, 
  SkeletonDisplayText,
  SkeletonBodyText, 
} from '@contentful/f36-components';
import { CloseIcon, EditIcon } from '@contentful/f36-icons';
import tokens from '@contentful/f36-tokens';
import styled from '@emotion/styled';
import { FC } from 'react';
import { hostNameFromUrl } from '../lib/hostname-from-url';
import { Plant } from '../models/plant';

const Container = styled(Flex)`
  position: absolute;
  z-index: 10000;
  right: 0;
  transform: ${props => props.open ? 'translateX(0%)' : 'translateX(100%)'};
  width: 380px;
  background-color: ${tokens.gray100};
  height: calc(100% - 70px);
  top: 70px;
  transition: transform ${tokens.transitionDurationDefault} ${tokens.transitionEasingDefault};
`;

const Header = styled(Flex)`
  height: 56px;
  border-bottom: 1px solid ${tokens.gray200};
  box-shadow: ${tokens.boxShadowPositive};
`;

const ContentContainer = styled(Flex)`
  height: 100%;
  overflow: hidden scroll;
`;

const CloseButton = styled(IconButton)`
  width: 50px;
  height: 55px;
  padding: 0 !important;
  svg {
    fill: ${tokens.gray400};
  }
  &:hover {
    svg {
      fill: ${tokens.gray500};
    }
  }
`;

const Title = styled(Subheading)`
  margin-right: auto !important;
`;

const HeaderBackContainer = styled(Box)`
  border-right: 1px solid ${tokens.gray200};
`;

const EditButton = styled(Button)`
  margin-right: ${tokens.spacingM};
`;

const UnderlinedSectionHeading = styled(SectionHeading)`
  color: ${tokens.gray500} !important;
  border-bottom: 1px solid ${tokens.gray400};
  line-height: 2 !important;
  user-select: none;
`;

const HelperText = styled(Text)`
  color: ${tokens.gray500} !important;
  font-size: ${tokens.fontSizeS} !important;
  line-height: 0.75rem !important;
  user-select: none;
`;

const ValueParagraph = styled(Paragraph)`
  font-size: 1rem !important;
`;

const WrapStack = styled(Stack)`
  flex-wrap: wrap;
  margin-bottom: ${tokens.spacingM};
`;

const FadedList = styled(List)`
  list-style: none;
  padding: 0 ${tokens.spacing2Xs};

  li::before {
    content: "\\2022";
    color: ${tokens.gray500};
    font-weight: bold;
    display: inline-block;
    width: 1rem;
  }
`;

const OneLineSkeleton: FC<{noMarginBotton?: boolean}> = ({ noMarginBotton }) => {
  return <SkeletonContainer style={{ height: '21px', marginBottom: noMarginBotton ? 0 : tokens.spacingS }} height="21px"><SkeletonBodyText numberOfLines={1} /></SkeletonContainer>
}

interface PlantAsideProps {
  plant?: Plant;
  open: boolean;
  onEditClick?: (plantId?: string) => void;
  onCloseClick?: () => void;
}

const PlantAside: FC<PlantAsideProps> = ({ plant, open, onEditClick, onCloseClick }) => {
  return <Container flexDirection="column" open={open}>
    <Header alignItems="center" gap="spacingM">
      <HeaderBackContainer>
        <CloseButton icon={<CloseIcon size="large" />} 
          variant="transparent" 
          aria-label={'Deselect ' + (plant ? plant.code : 'Loading...')} 
          onClick={() => onCloseClick?.()}
        />
      </HeaderBackContainer>
      {plant ? <Title marginBottom="none">{plant.code}</Title> : <SkeletonContainer style={{ height: '20px' }} height="20px"><SkeletonDisplayText /></SkeletonContainer>}
      <EditButton startIcon={<EditIcon />} variant="positive" isDisabled={!plant} onClick={() => onEditClick?.(plant?.id)}>
        Edit
      </EditButton>
    </Header>
    <ContentContainer flexDirection="column" padding="spacingM">
      <UnderlinedSectionHeading marginBottom="spacingXs">Latin name</UnderlinedSectionHeading>
      {plant ? <Paragraph>{plant.fullLatinName}</Paragraph> : <OneLineSkeleton />}
      <UnderlinedSectionHeading marginBottom="spacingXs">Common name</UnderlinedSectionHeading>
      {plant ? <Paragraph>{plant.commonName}</Paragraph> : <OneLineSkeleton />}
      <UnderlinedSectionHeading marginBottom="spacingXs">Fully grown size</UnderlinedSectionHeading>
      {plant ? <ValueParagraph marginBottom="none">
        {plant.height}&nbsp;m x {plant.width}&nbsp;m
      </ValueParagraph> : <OneLineSkeleton noMarginBotton />}
      <HelperText marginBottom="spacingM">
        height x diameter
      </HelperText>
      <UnderlinedSectionHeading marginBottom="spacingXs">Tags</UnderlinedSectionHeading>
      {plant ? <WrapStack spacing="spacingXs" alignItems="flex-start">
        {plant.tags.map(tag => (
          <Pill key={tag} label={tag} />
        ))}
      </WrapStack> : <OneLineSkeleton />}
      <UnderlinedSectionHeading marginBottom="spacingXs">Sources</UnderlinedSectionHeading>
      {plant ? <FadedList as="ul">
        {plant.sourceLinks.map(link => (
          <List.Item key={link}>
            <TextLink target="_blank" href={link}>{hostNameFromUrl(link)}</TextLink>
          </List.Item>
        ))}
      </FadedList> : <OneLineSkeleton />}
    </ContentContainer>
  </Container>;
}

export default PlantAside;