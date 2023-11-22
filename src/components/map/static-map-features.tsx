import { FC } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';
import staticMapFeatureCollection from '../../data/static-map.feature-collection';

const StaticMapFeatures: FC = () => {
    return <Source id="static-map-features" type="geojson" data={staticMapFeatureCollection}>
        <Layer
        type='fill'
        paint={{
          'fill-color': 'blue',
          'fill-opacity': 0.2,
        }}
        filter={['==', 'id', 'gartempe']}
      />
      <Layer
        type='line'
        paint={{
          'line-color': 'gray',
        }}
        filter={['==', 'id', 'terrain']}
      />
      <Layer
        type='line'
        paint={{
          'line-color': 'gray',
        }}
        filter={['==', 'id', 'fences']}
      />
      <Layer
        type='line'
        paint={{
          'line-color': 'gray',
          'line-dasharray': [2, 2]
        }}
        filter={['==', 'id', 'doors']}
      />
      <Layer
        type='fill'
        paint={{
          'fill-color': 'blue',
          'fill-opacity': 0.2,
        }}
        filter={['==', 'id', 'happyLake']}
      />
      <Layer
        type='fill'
        paint={{
          'fill-color': 'black',
          'fill-outline-color': 'black',
          'fill-opacity': 0.1,
        }}
        filter={['==', 'id', 'd116']}
      />
      <Layer
        type='fill'
        paint={{
          'fill-color': 'black',
          'fill-outline-color': 'transparent',
          'fill-opacity': 0.2,
        }}
        filter={['==', 'id', 'path']}
      />
      <Layer
        type='fill'
        paint={{
          'fill-color': 'blue',
          'fill-opacity': 0.2,
        }}
        filter={['==', 'id', 'ponds']}
      />
    </Source>;
};

export default StaticMapFeatures;
