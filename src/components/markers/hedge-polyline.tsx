import { PathOptions, Renderer } from 'leaflet';
import { FC, useMemo, useState } from 'react';
import { Polyline, useMapEvent } from 'react-leaflet';
import { metersPerPixel } from '../../lib/leaflet/meters-per-pixel';
import { Hedge } from '../../models/hedge';

interface HedgePolylineProps {
  hedge: Hedge;
  renderer: Renderer,
}

const HEDGE_WIDTH = 1.5;

const HedgePolyline: FC<HedgePolylineProps> = ({ hedge, renderer }) => {
  const [lat, setLat] = useState<number>(43);
  const [zoom, setZoom] = useState<number>(17);
  const weight = useMemo(() => {
    console.log('calculate wright');
    return HEDGE_WIDTH / metersPerPixel(lat, zoom);
  }, [lat, zoom]);

  useMapEvent('moveend', (e) => {
    setLat(e.target._lastCenter.lat);
    setZoom(e.target._zoom);
  });

  const options = useMemo<PathOptions>(() => {
    return { color: 'brown', weight, opacity: 0.3 };
  }, [weight]);

  return <Polyline 
    positions={hedge.coords}
    pathOptions={options}
    renderer={renderer}
  ></Polyline>;
}

export default HedgePolyline;