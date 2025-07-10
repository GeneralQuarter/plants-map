import type { LatLng, Polygon as LeafletPolygon, Renderer } from 'leaflet';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import type { MapZone } from '../../models/map-zone';

interface MapZoneProps {
  mapZone: MapZone;
  onCoordsChange: (newCoords: [number, number][]) => void;
  onClick: (event: MouseEvent) => void;
  renderer: Renderer;
}

const MapZoneMarker: FC<MapZoneProps> = ({
  mapZone,
  onCoordsChange,
  onClick,
  renderer,
}) => {
  const polygonRef = useRef<LeafletPolygon | null>(null);
  const [locked, setLocked] = useState<boolean>(true);
  const [newCoords, setNewCoords] = useState<[number, number][] | null>(null);

  const eventHandlers = useMemo(
    () => ({
      contextmenu() {
        if (!locked && newCoords) {
          onCoordsChange?.(newCoords);
          setNewCoords(null);
        }

        setLocked(!locked);
      },
      click(e: { target: LeafletPolygon; originalEvent: MouseEvent }) {
        if (e.target.pm.dragging()) {
          return;
        }

        onClick(e.originalEvent);
      },
      'pm:dragend': (e: { target: LeafletPolygon }) => {
        const latLngs = e.target.getLatLngs()[0] as LatLng[];
        setNewCoords(latLngs.map((ll) => [ll.lat, ll.lng]));
      },
      'pm:rotateend': (e: { target: LeafletPolygon }) => {
        const latLngs = e.target.getLatLngs()[0] as LatLng[];
        setNewCoords(latLngs.map((ll) => [ll.lat, ll.lng]));
      },
    }),
    [locked, newCoords, onCoordsChange, onClick],
  );

  useEffect(() => {
    const polygon = polygonRef.current;

    if (!polygon) {
      return;
    }

    if (locked) {
      setTimeout(() => {
        polygon.pm.disableLayerDrag();
      }, 0);
      polygon.setStyle({ fillColor: 'transparent' });
    } else {
      polygon.pm.enableLayerDrag();
      polygon.setStyle({ fillColor: 'blue' });
    }
  }, [locked]);

  return (
    <Polygon
      positions={mapZone.coords ?? []}
      ref={polygonRef}
      eventHandlers={eventHandlers}
      weight={1}
      pathOptions={{ color: 'black' }}
      renderer={renderer}
    >
      <Tooltip direction="center" className="rectangle-label">
        <span className="label">{mapZone.name}</span>
      </Tooltip>
    </Polygon>
  );
};

export default MapZoneMarker;
