import { IconButton } from '@contentful/f36-components';
import saveAs from 'file-saver';
import { unparse } from 'papaparse';
import type { FC } from 'react';
import type { Plant } from '../models/plant';
import ImportIcon from './icons/import.icon';

interface EmlidRow {
  Name: string;
  Longitude: string;
  Latitude: string;
  Elevation: string;
}

interface PointsExportProps {
  exportedIds: string[];
  isExportSelecting: boolean;
  setIsExportSelecting: (isExportSelecting: boolean) => void;
  clearExportedIds: () => void;
  plants: Plant[] | undefined;
}

const PointsExport: FC<PointsExportProps> = ({
  exportedIds,
  isExportSelecting,
  setIsExportSelecting,
  plants,
}) => {
  const exportClick = () => {
    if (!isExportSelecting) {
      setIsExportSelecting(true);
      return;
    }

    const rows: EmlidRow[] = exportedIds
      .map((id) => plants?.find((p) => p.id === id))
      .filter((n) => !!n)
      .map((p) => ({
        Name: p?.code ?? '',
        Longitude: p?.position?.[1].toFixed(8) ?? '',
        Latitude: p?.position?.[0].toFixed(8) ?? '',
        Elevation: '0.0',
      }));

    const csv = unparse<EmlidRow>(rows);
    saveAs(
      new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
      `exported-points-${Date.now()}.csv`,
    );
    // clearExportedIds();
    setIsExportSelecting(false);
  };

  return (
    <IconButton
      variant={isExportSelecting ? 'primary' : 'positive'}
      icon={<ImportIcon />}
      aria-label="Export CSV"
      onClick={() => exportClick()}
    />
  );
};

export default PointsExport;
