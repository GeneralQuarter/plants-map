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
  forestEdge: [
    [0.88287503, 46.37767786],
    [0.88290606, 46.37778357],
    [0.88295018, 46.37785656],
    [0.88299135, 46.37796499],
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
  fence1: [
    [0.88255908, 46.38047773, -0.143],
    [0.88300868, 46.38052220, 0.096],
  ],
  fence2: [
    [0.88306767, 46.38052901, 0.127],
    [0.88352433, 46.38057418, 0.238],
  ],
  fence3: [
    [0.88349417, 46.38061569, 0.293],
    [0.88352433, 46.38057418, 0.238],
    [0.88350440, 46.38052794, 0.040],
  ],
  fence4: [
    [0.88362971, 46.38062693, 0.130],
    [0.88361843, 46.38058201, -0.041],
    [0.88354757, 46.38050559, -0.011],
  ],
  fence5: [
    [0.88361843, 46.38058201, -0.041],
    [0.88384652, 46.38060820, 0.094],
  ],
  fence6: [
    [0.88390463, 46.38061417, -0.054],
    [0.88413271, 46.38063868, 0.067],
    [0.88425496, 46.38063051, 0.177],
  ],
  fence7: [
    [0.88158727,46.37853294],
    [0.88228781,46.37850005],
    [0.88312900,46.37845885],
    [0.88347800,46.37841348],
    [0.88387398,46.37833294],
  ],
  door1: [
    [0.88300868, 46.38052220, 0.096],
    [0.88306767, 46.38052901, 0.127]
  ],
  door2: [
    [0.88350440, 46.38052794, 0.040],
    [0.88354757, 46.38050559, -0.011]
  ],
  door3: [
    [0.88384652, 46.38060820, 0.094],
    [0.88390463, 46.38061417, -0.054]
  ],
  door4: [
    [0.88158807, 46.37853226],
    [0.88152369, 46.37853490]
  ],
};

const highTensionLinePathOptions: PathOptions = { color: 'blue', opacity: 0.3, weight: 1 };
const fencePathOptions: PathOptions = { color: 'black', opacity: 0.4, weight: 2 };
const doorPathOptions: PathOptions = { color: 'black', opacity: 0.4, dashArray: '2 6', weight: 2 };

const fences: HardcodedMapObject[] = Object.entries(rawCoordinates)
  .filter(([key, _]) => key.startsWith('fence'))
  .map(([_, coords], i) => ({
    label: `Fence - ${i + 1}`,
    positions: coords.map(latLngAlt => latLngAtlToLatLng(latLngAlt)),
    pathOptions: fencePathOptions
  }));

const doors: HardcodedMapObject[] = Object.entries(rawCoordinates)
  .filter(([key, _]) => key.startsWith('door'))
  .map(([_, coords], i) => ({
    label: `Door - ${i + 1}`,
    positions: coords.map(latLngAlt => latLngAtlToLatLng(latLngAlt)),
    pathOptions: doorPathOptions
  }));

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
    label: 'Forest\'s edge',
    positions: rawCoordinates.forestEdge.map(latLngAlt => latLngAtlToLatLng(latLngAlt)),
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
  ...fences,
  ...doors,
];

export default POLYLINES;
