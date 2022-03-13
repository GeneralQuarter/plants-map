import { Renderer } from 'leaflet';
import { FC, useMemo } from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';
import { MeasuredPoint } from '../../models/measured-point';

interface MeasuredPointMarkerProps {
  point: MeasuredPoint;
  renderer: Renderer;
}

const MeasuredPointMarker: FC<MeasuredPointMarkerProps> = ({ point, renderer }) => {
  const fillColor = useMemo(() => {
    return point.height > 10 ? 'orange' : 'blue';
  }, [point.height]);

  return <CircleMarker center={point.coords} radius={0.5} renderer={renderer} fillColor={fillColor} color={fillColor}>
    <Tooltip className="measured-point-label"><b>{point.name}</b><br />{point.height.toFixed(3)}m</Tooltip>
  </CircleMarker>;
}

export default MeasuredPointMarker;