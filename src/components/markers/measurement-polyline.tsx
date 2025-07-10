import type { PathOptions } from 'leaflet';
import { type FC, useMemo } from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import { distanceTo } from '../../lib/leaflet/distance-to';
import type { MeasurementLine } from '../../models/measurement-line';

interface MeasurementPolylineProps {
  line: MeasurementLine;
  tooltipClick?: () => void;
}

const measurementPathOptions: PathOptions = {
  color: 'purple',
  dashArray: '3',
  weight: 1,
};

const MeasurementPolyline: FC<MeasurementPolylineProps> = ({
  line,
  tooltipClick,
}) => {
  const distance = useMemo(() => {
    return distanceTo(line.start, line.end).toFixed(2);
  }, [line.start, line.end]);

  return (
    <Polyline
      positions={[line.start, line.end]}
      pathOptions={measurementPathOptions}
    >
      <Tooltip direction="center" interactive={true} permanent={true}>
        <button
          type="button"
          onClick={() => {
            tooltipClick?.();
          }}
        >
          {distance}&nbsp;m
        </button>
      </Tooltip>
    </Polyline>
  );
};

export default MeasurementPolyline;
