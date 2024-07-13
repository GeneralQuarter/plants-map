import { IconButton } from '@contentful/f36-components';
import styled from '@emotion/styled';
import { ChangeEvent, FC, useRef } from 'react';
import { parse } from 'papaparse';
import { MeasuredPoint } from '../models/measured-point';
import ExportIcon from './icons/export.icon';
import { useQueryClient } from 'react-query';
import { Plant } from '../models/plant';
import { plantsWithPositionQueryKey } from '../lib/queries/plants-with-position.query';
import { MARKED_TAG_ID } from '../data/keys';

interface PointsLoaderProps {
  setMeasuredPoints: (points: MeasuredPoint[]) => void;
}

const HiddenFileInput = styled.input`
  display: none;
`;

const PointsLoader: FC<PointsLoaderProps> = ({ setMeasuredPoints }) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    if (e.target.files[0].name.endsWith('.json')) {
      const marked = JSON.parse(await e.target.files[0].text());
      queryClient.setQueryData<Plant[]>(plantsWithPositionQueryKey, (old = []) => {
        const newPlants = [...old];

        for (const plantId of marked) {
          const plantIndex = old.findIndex(p => p.id === plantId);

          if (plantIndex === -1) {
            continue;
          }

          const oldPlant = old[plantIndex];

          if (oldPlant.tags.includes(MARKED_TAG_ID)) {
            continue;
          }

          const newPlantTags = [...oldPlant.tags, MARKED_TAG_ID];
          const newPlant = {...oldPlant, tags: newPlantTags};
          newPlants.splice(plantIndex, 1, newPlant);
        }

        return newPlants;
      });
      return;
    }

    parse(e.target.files[0], {
      header: true,
      complete: r => {
        const firstRow: any = r.data[0];

        if (!firstRow.Name || !firstRow.Latitude || !firstRow.Longitude || !firstRow['Ellipsoidal height']) {
          return;
        }

        const measuredPoints = r.data.map((d: any) => ({
          name: d.Name,
          coords: [parseFloat(d.Latitude), parseFloat(d.Longitude)],
          height: parseFloat(d['Ellipsoidal height']),
          description: d.Description,
        }) as MeasuredPoint).filter(n => !!n.name);

        setMeasuredPoints(measuredPoints);
      }
    })
  }

  return <>
    <IconButton variant="positive" icon={<ExportIcon />} aria-label="Import CSV or JSON" onClick={() => fileInput.current?.click()}/>
    <HiddenFileInput type="file" ref={fileInput} accept=".csv,.json" onChange={onChange} />
  </>;
}

export default PointsLoader;
