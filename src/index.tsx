import { SDKProvider } from '@contentful/react-apps-toolkit';
import { createRoot } from 'react-dom/client';
import App from './app';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Missing root container');
}

const root = createRoot(container);

root.render(
  <SDKProvider>
    <App />
  </SDKProvider>,
);
