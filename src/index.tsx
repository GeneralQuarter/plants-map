import React from 'react';
import { createRoot } from 'react-dom/client';

import {
  AppExtensionSDK,
  PageExtensionSDK,
  init,
  locations,
} from '@contentful/app-sdk';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import './index.scss';

import Config from './components/config-screen';
import Page from './components/page';

init((sdk) => {
  const root = createRoot(document.getElementById('root')!);

  const ComponentLocationSettings = [
    {
      location: locations.LOCATION_APP_CONFIG,
      component: <Config sdk={sdk as AppExtensionSDK} />,
    },
    {
      location: locations.LOCATION_PAGE,
      component: <Page sdk={sdk as PageExtensionSDK} />,
    },
  ];

  ComponentLocationSettings.forEach((componentLocationSetting) => {
    if (sdk.location.is(componentLocationSetting.location)) {
      root.render(componentLocationSetting.component);
    }
  });
});