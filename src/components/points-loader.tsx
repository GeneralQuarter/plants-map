import { IconButton } from '@contentful/f36-components';
import styled from '@emotion/styled';
import { ChangeEvent, FC, useRef } from 'react';
import { parse } from 'papaparse';
import { MeasuredPoint } from '../models/measured-point';
import ExportIcon from './icons/export.icon';

interface PointsLoaderProps {
  setMeasuredPoints: (points: MeasuredPoint[]) => void;
}

const HiddenFileInput = styled.input`
  display: none;
`;

const PointsLoader: FC<PointsLoaderProps> = ({ setMeasuredPoints }) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
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
          height: parseFloat(d['Ellipsoidal height'])
        }) as MeasuredPoint).filter(n => !!n.name);

        setMeasuredPoints(measuredPoints);
      }
    })
  }

  return <>
    <IconButton variant="positive" icon={<ExportIcon />} aria-label="Import CSV" onClick={() => fileInput.current?.click()}/>
    <HiddenFileInput type="file" ref={fileInput} accept=".csv" onChange={onChange} />
  </>;
}

export default PointsLoader;