import { LeafletMouseEvent, Renderer } from 'leaflet';
import { FC, useMemo } from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';
import { MeasuredPoint } from '../../models/measured-point';

interface MeasuredPointMarkerProps {
  point: MeasuredPoint;
  renderer: Renderer;
  onClick?: (event: LeafletMouseEvent) => void;
}

const MeasuredPointMarker: FC<MeasuredPointMarkerProps> = ({ point, renderer, onClick }) => {
  const fillColor = useMemo(() => {
    return point.height > 10 ? 'orange' : 'blue';
  }, [point.height]);

  const eventHandlers = useMemo(() => ({
    click: (e: LeafletMouseEvent) => {
      onClick?.(e);
    }
  }), [onClick]);

  return <CircleMarker center={point.coords} radius={0.5} renderer={renderer} fillColor={fillColor} color={fillColor} eventHandlers={eventHandlers}>
    <Tooltip className="measured-point-label">
      <b>{point.name}</b><br />
      {point.height.toFixed(3)}m<br/>
      {point.description && <>{point.description}<br /></>}
      </Tooltip>
  </CircleMarker>;
}

export default MeasuredPointMarker;
