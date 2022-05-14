import { PageExtensionSDK } from '@contentful/app-sdk';
import { GlobalStyles } from '@contentful/f36-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import Main from './main';

import '@geoman-io/leaflet-geoman-free';

interface PageProps {
  sdk: PageExtensionSDK;
}

const queryClient = new QueryClient();

const Page = ({ sdk }: PageProps) => {
  return <QueryClientProvider client={queryClient}>
    <>
      <GlobalStyles />
      <Main sdk={sdk} />
    </>
  </QueryClientProvider>;
};

export default Page;
