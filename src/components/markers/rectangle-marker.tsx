import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { Rectangle } from '../../models/rectangle';
import { LatLng, Polygon as LeafletPolygon, Renderer } from 'leaflet';
import { rectangleDimensions } from '../../lib/rectangle-dimensions-text';

interface RectangleMarkerProps {
  rectangle: Rectangle;
  onCoordsChange: (newCoords: [number, number][]) => void;
  onClick: () => void;
  renderer: Renderer;
}

const RectangleMarker: FC<RectangleMarkerProps> = ({ rectangle, onCoordsChange, onClick, renderer }) => {
  const polygonRef = useRef<LeafletPolygon | null>(null);
  const [locked, setLocked] = useState<boolean>(true);
  const [newCoords, setNewCoords] = useState<[number, number][] | null>(null);

  const eventHandlers = useMemo(() => ({
    contextmenu() {
      if (!locked && newCoords) {
        onCoordsChange?.(newCoords);
        setNewCoords(null);
      }

      setLocked(!locked);
    },
    click(e: {target: LeafletPolygon, originalEvent: MouseEvent}) {
      if (e.target.pm.dragging()) {
        return;
      }

      onClick();
    },
    'pm:dragstart': () => {
      const polygon = polygonRef.current;

      if (!polygon) {
        return;
      }

      polygon.pm.disableRotate();
    },
    'pm:dragend': (e: { target: LeafletPolygon }) => {
      const latLngs = e.target.getLatLngs()[0] as LatLng[];
      setNewCoords(latLngs.map(ll => [ll.lat, ll.lng]));

      const polygon = polygonRef.current;

      if (!polygon) {
        return;
      }

      polygon.pm.enableRotate();
    },
    'pm:rotateend': (e: { target: LeafletPolygon }) => {
      const latLngs = e.target.getLatLngs()[0] as LatLng[];
      setNewCoords(latLngs.map(ll => [ll.lat, ll.lng]));
    }
  }), [locked, newCoords, onCoordsChange, polygonRef, onClick]);

  useEffect(() => {
    const polygon = polygonRef.current;

    if (!polygon) {
      return;
    }

    if (locked) {
      setTimeout(() => {
        polygon.pm.disableLayerDrag()
        polygon.pm.disableRotate();
      }, 0);
      polygon.setStyle({ fillColor: 'purple' });
    } else {
      polygon.pm.enableLayerDrag();
      polygon.pm.enableRotate();
      polygon.setStyle({ fillColor: 'blue' });
    }
  }, [polygonRef, locked])

  return <Polygon 
    positions={rectangle.coords ?? []}
    ref={polygonRef}
    eventHandlers={eventHandlers}
    weight={1}
    pathOptions={{ color: 'purple' }}
    renderer={renderer}
  >
    <Tooltip direction="center" className="rectangle-label">
      <span className="label">{rectangle.label}</span>
      <div className="dimensions">{rectangleDimensions(rectangle)}</div>
    </Tooltip>
  </Polygon>;
}

export default RectangleMarker;