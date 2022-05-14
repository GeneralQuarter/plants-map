import { LatLngTuple, Map } from 'leaflet';
import { FC, PropsWithChildren } from 'react';
import { MapContainer } from 'react-leaflet';
import { addSmoothWheelZoom } from '../lib/leaflet/add-smooth-wheel-zoom';

const initialCenter: LatLngTuple = [46.37926, 0.88279];

interface EditorMapProps {
  setMap: (map: Map) => void;
}

const EditorMap: FC<PropsWithChildren<EditorMapProps>> = ({ children, setMap }) => {
  return <MapContainer
    center={initialCenter}
    zoom={17}
    maxZoom={23}
    style={{ width: '100vw', height: '100vh' }}
    scrollWheelZoom={false}
    doubleClickZoom={false}
    zoomControl={false}
    ref={(map: Map | null) => {
      if (!map) {
        return;
      }

      addSmoothWheelZoom(map);
      setMap(map);
    }}
  >
    {children}
  </MapContainer>;
}

export default EditorMap;