import type { PathOptions, Renderer } from 'leaflet';
import { type FC, useMemo, useState } from 'react';
import { Polyline, Tooltip, useMapEvent } from 'react-leaflet';
import { metersPerPixel } from '../../lib/leaflet/meters-per-pixel';
import type { Hedge } from '../../models/hedge';

interface HedgePolylineProps {
  hedge: Hedge;
  renderer: Renderer;
  onClick: () => void;
}

const HEDGE_WIDTH = 1.5;

const HedgePolyline: FC<HedgePolylineProps> = ({
  hedge,
  renderer,
  onClick,
}) => {
  const [lat, setLat] = useState<number>(43);
  const [zoom, setZoom] = useState<number>(17);
  const weight = useMemo(() => {
    return HEDGE_WIDTH / metersPerPixel(lat, zoom);
  }, [lat, zoom]);

  const eventHandlers = useMemo(
    () => ({
      click() {
        onClick();
      },
    }),
    [onClick],
  );

  useMapEvent('moveend', (e) => {
    if (!e.target._lastCenter) {
      return;
    }

    setLat(e.target._lastCenter.lat);
    setZoom(e.target._zoom);
  });

  const options = useMemo<PathOptions>(() => {
    return { color: 'brown', weight, opacity: 0.3 };
  }, [weight]);

  return (
    <Polyline
      positions={hedge.coords}
      pathOptions={options}
      renderer={renderer}
      eventHandlers={eventHandlers}
    >
      <Tooltip>{hedge.name}</Tooltip>
    </Polyline>
  );
};

export default HedgePolyline;
