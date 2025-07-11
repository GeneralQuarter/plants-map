import type { PageAppSDK } from '@contentful/app-sdk';
import { createClient } from 'contentful';
import type { AppInstallationParameters } from '../../components/config-screen';

export function createCDAClient(sdk: PageAppSDK) {
  return createClient({
    accessToken: (sdk.parameters.installation as AppInstallationParameters)
      .cdaToken,
    space: sdk.ids.space,
  });
}
