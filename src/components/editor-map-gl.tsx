import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map, MapLayerMouseEvent, MapGeoJSONFeature } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Map as MaplibreMap, MapLibreEvent, StyleSpecification } from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import SimpleDragCustomDrawMode from '../simple-drag.custom-draw-mode';

type EditorMapGLProps = {
  onFeatureMoved?: (feature: MapGeoJSONFeature) => void;
};

const EditorMapGL: FC<PropsWithChildren<EditorMapGLProps>> = ({ children, onFeatureMoved }) => {
  const drawRef = useRef<MapboxDraw | undefined>(undefined);
  const [map, setMap] = useState<MaplibreMap | undefined>(undefined);
  const mapStyle: StyleSpecification = useMemo(() => ({
    version: 8, glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf', sources: {}, layers: [{
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#fff' }
    }]
  }), []);

  const onContextMenu = useCallback((e: MapLayerMouseEvent) => {
    const firstFeature = e.features?.[0];

    if (!firstFeature) {
      return;
    }

    drawRef.current?.deleteAll();

    const ids = drawRef.current?.add(firstFeature);
    const firstId = ids?.[0];

    if (firstId) {
      drawRef.current?.changeMode('simple_drag', {
        featureIds: [firstId]
      });
    }
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    let draw = new MapboxDraw({
      modes: {
        'simple_drag': SimpleDragCustomDrawMode
      },
      defaultMode: 'simple_drag'
    });

    drawRef.current = draw;

    // @ts-ignore
    map.addControl(draw, 'bottom-right');

    let drawDropListener = (e: {action: 'confirm' | 'cancel', features: MapGeoJSONFeature[]}) => {
      if (e.action === 'confirm') {
        const firstFeature = e.features[0];
        onFeatureMoved?.(firstFeature);
      }

      setTimeout(() => {
        draw.deleteAll();
      }, 1);
    }

    map.on('draw.drop', drawDropListener);

    return () => {
      // @ts-ignore
      map.removeControl(draw);
      map.off('draw.drop', drawDropListener);
    }
  }, [map]);

  const onLoad = useCallback((e: MapLibreEvent) => {
    setMap(e.target);
  }, []);

  return (
    <Map
      initialViewState={{
        longitude: 0.88279,
        latitude: 46.37926,
        zoom: 17,
      }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle={mapStyle}
      interactiveLayerIds={['plant-fill']}
      onContextMenu={onContextMenu}
      onLoad={onLoad}
    >
      {children}
    </Map>
  );
};

export default EditorMapGL;
