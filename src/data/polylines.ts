import { latLngAtlToLatLng } from '../lib/leaflet/latLngAltToLatLng';
import { HardcodedMapObject } from '../models/leaflet/hardcoded-map-object';
import { RawCoords } from '../models/leaflet/raw-coords';
import { PathOptions } from 'leaflet';

const rawCoordinates: RawCoords = {
  twoMetersNorth: [
    [
      0.8816324218992855,
      46.37910684768195,
      104.5612173616502
    ],
    [
      0.8817449078333328,
      46.37961463412318,
      104.8388895345137
    ],
    [
      0.8823814465058044,
      46.37954049653529,
      105.1165617073772
    ],
    [
      0.8825896310848802,
      46.38050805363117,
      104.8956428544785
    ],
    [
      0.8842361860302694,
      46.38066967940922,
      105.7276131033575
    ],
    [
      0.8840477369402766,
      46.37957226935455,
      102.9068832884785
    ]
  ],
  highTensionLine1: [
    [
      0.8841199961725144,
      46.37980328510424,
      104.5343941426353
    ],
    [
      0.883093143256537,
      46.38068958264289,
      105.4236736640557
    ]
  ],
  highTensionLine2: [
    [
      0.8830957181374255,
      46.38069830654771,
      105.4496762002659
    ],
    [
      0.8841252564713709,
      46.37981105939226,
      104.559109143679
    ]
  ],
  highTensionLine3: [
    [
      0.8830864874377808,
      46.38067966288033,
      105.386497537373
    ],
    [
      0.8841156968082098,
      46.37979407222222,
      104.4616153885371
    ]
  ],
  edge1: [
    [0.88330368, 46.38026201, 0.157],
    [0.88325492, 46.38029621, 0.225],
    [0.88322326, 46.38033326, -0.022],
    [0.88319588, 46.38035818, 0.103],
    [0.88317756, 46.38038055, 0.075],
    [0.88313635, 46.38042810, 0.065],
    [0.88309535, 46.38047487, -0.119]
  ],
  edge2: [
    [0.88281987, 46.38029194, -0.050],
    [0.88286053, 46.38033018, -0.045],
    [0.88289364, 46.38036899, -0.145],
    [0.88293807, 46.38041127, 0.020],
    [0.88297783, 46.38046908, -0.074]
  ],
  edge3: [
    [0.88320636, 46.38025756, 0.061],
    [0.88313711, 46.38028823, 0.099],
    [0.88307046, 46.38037622, -0.072]
  ]
};

const highTensionLinePathOptions: PathOptions = { color: 'blue', opacity: 0.3, weight: 1 };
const edgePathOptions: PathOptions = { color: 'indigo', fillOpacity: 0.2, dashArray: '2 4', weight: 2 };

const POLYLINES: HardcodedMapObject[] = [
  {
    label: 'Two meteres line (north)',
    positions: rawCoordinates.twoMetersNorth.map(latLngAlt => latLngAtlToLatLng(latLngAlt)),
    pathOptions: {
      color: 'gray',
      fillOpacity: 0.2,
      dashArray: '2',
      weight: 1,
    },
  },
  {
    label: 'High Tension Line - 1',
    positions: rawCoordinates.highTensionLine1.map(latLngAlt => latLngAtlToLatLng(latLngAlt)),
    pathOptions: highTensionLinePathOptions
  },
  {
    label: 'High Tension Line - 2',
    positions: rawCoordinates.highTensionLine2.map(latLngAlt => latLngAtlToLatLng(latLngAlt)),
    pathOptions: highTensionLinePathOptions
  },
  {
    label: 'High Tension Line - 3',
    positions: rawCoordinates.highTensionLine3.map(latLngAlt => latLngAtlToLatLng(latLngAlt)),
    pathOptions: highTensionLinePathOptions
  },
  {
    label: 'Edge - 1',
    positions: rawCoordinates.edge1.map(latLngAlt => latLngAtlToLatLng(latLngAlt)),
    pathOptions: edgePathOptions
  },
  {
    label: 'Edge - 2',
    positions: rawCoordinates.edge2.map(latLngAlt => latLngAtlToLatLng(latLngAlt)),
    pathOptions: edgePathOptions
  },
  {
    label: 'Edge - 3',
    positions: rawCoordinates.edge3.map(latLngAlt => latLngAtlToLatLng(latLngAlt)),
    pathOptions: edgePathOptions
  }
];

export default POLYLINES;