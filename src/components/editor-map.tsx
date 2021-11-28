import { LatLngTuple, Map } from 'leaflet';
import { FC, PropsWithChildren } from 'react';
import { MapContainer } from 'react-leaflet';
import { addSmoothWheelZoom } from '../lib/leaflet/add-smooth-wheel-zoom';

const initialCenter: LatLngTuple = [46.37926, 0.88279];

interface EditorMapProps {
  setMap: (map: Map) => void;
}

const EditorMap: FC<PropsWithChildren<EditorMapProps>> = ({ children, setMap }) => {
  const whenCreated = (map: Map) => {
    addSmoothWheelZoom(map);
    setMap(map);
  }

  return <MapContainer
    center={initialCenter}
    zoom={17}
    maxZoom={23}
    style={{ width: '100vw', height: '100vh' }}
    scrollWheelZoom={false}
    doubleClickZoom={false}
    zoomControl={false}
    whenCreated={whenCreated}
  >
    {children}
  </MapContainer>;
}

export default EditorMap;