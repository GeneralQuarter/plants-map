import type { Polygon as LeafletPolygon, Renderer } from 'leaflet';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { Polygon } from 'react-leaflet';
import type { MapSector, MapSectorGeoJSON } from '../../models/map-sector';

type MapSectorMarkerProps = {
  mapSector: MapSector;
  onGeoJsonChange: (geojson: MapSectorGeoJSON) => void;
  onClick: (event: MouseEvent) => void;
  renderer: Renderer;
};

const MapSectorMarker: FC<MapSectorMarkerProps> = ({
  mapSector,
  renderer,
  onGeoJsonChange,
  onClick,
}) => {
  const polygonRef = useRef<LeafletPolygon | null>(null);
  const [locked, setLocked] = useState<boolean>(true);

  const eventHandlers = useMemo(
    () => ({
      contextmenu() {
        setLocked(false);
      },
      click(e: { target: LeafletPolygon; originalEvent: MouseEvent }) {
        if (e.target.pm.enabled()) {
          return;
        }

        onClick(e.originalEvent);
      },
      dblclick(e: { target: LeafletPolygon; originalEvent: MouseEvent }) {
        const polygon = polygonRef.current;

        if (!polygon) {
          return;
        }

        if (!e.target.pm.enabled()) {
          return;
        }

        setLocked(true);
        onGeoJsonChange?.(polygon.toGeoJSON() as MapSectorGeoJSON);
      },
    }),
    [onClick, onGeoJsonChange],
  );

  useEffect(() => {
    const polygon = polygonRef.current;

    if (!polygon) {
      return;
    }

    if (locked) {
      setTimeout(() => {
        polygon.pm.disable();
      }, 0);
      polygon.setStyle({ fillColor: 'olive' });
    } else {
      polygon.pm.enable();
      polygon.setStyle({ fillColor: 'blue' });
    }
  }, [locked]);

  return (
    <Polygon
      positions={mapSector.geojson.geometry.coordinates[0].map((c) => [
        c[1],
        c[0],
      ])}
      ref={polygonRef}
      eventHandlers={eventHandlers}
      weight={1}
      pathOptions={{ color: 'blue', dashArray: [4, 2] }}
      renderer={renderer}
    ></Polygon>
  );
};

export default MapSectorMarker;
