import { PageAppSDK } from '@contentful/app-sdk';
import { GlobalStyles } from '@contentful/f36-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import Main from './main';
import { useSDK } from '@contentful/react-apps-toolkit';

import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import './page.scss';
import '@geoman-io/leaflet-geoman-free';

const queryClient = new QueryClient();

const Page = () => {
  const sdk = useSDK() as PageAppSDK;

  return <QueryClientProvider client={queryClient}>
    <>
      <GlobalStyles />
      <Main sdk={sdk} />
    </>
  </QueryClientProvider>;
};

export default Page;
