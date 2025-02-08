import { FC, useMemo } from 'react';
import { Plant } from '../models/plant';
import { DisplayText, Stack, Subheading } from '@contentful/f36-components';

type CountsProps = {
  plants?: Plant[];
};

const Counts: FC<CountsProps> = ({ plants }) => {
  const notDeadPlants = plants?.filter(p => !p.tags.includes('dead'));
  const counts = useMemo(() => {
    return {
      planted: notDeadPlants?.filter(p => p.tags.includes('planted')).length ?? 0,
      positioned: notDeadPlants?.length ?? 0,
      dead: (plants?.length ?? 0) - (notDeadPlants?.length ?? 0)
    }
  }, [plants]);

  return <Stack>
    <Stack flexDirection='column' alignItems='flex-start' spacing='none'>
      <DisplayText marginBottom='none' fontColor='green800'>{counts.planted}</DisplayText>
      <Subheading marginBottom='none' fontColor='green800'>Planted</Subheading>
    </Stack>
    <Stack flexDirection='column' alignItems='flex-start' spacing='none'>
      <DisplayText marginBottom='none' fontColor='gray800'>{counts.positioned}</DisplayText>
      <Subheading marginBottom='none' fontColor='gray800'>Positioned</Subheading>
    </Stack>
    <Stack flexDirection='column' alignItems='flex-start' spacing='none'>
      <DisplayText marginBottom='none' fontColor='red800'>{counts.dead}</DisplayText>
      <Subheading marginBottom='none' fontColor='red800'>Dead</Subheading>
    </Stack>
  </Stack>;
}

export default Counts;
