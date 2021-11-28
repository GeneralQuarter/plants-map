import { PageExtensionSDK } from '@contentful/app-sdk';
import { createClient } from 'contentful';
import { AppInstallationParameters } from '../../components/config-screen';

export function createCDAClient(sdk: PageExtensionSDK) {
  return createClient({
    accessToken: (sdk.parameters.installation as AppInstallationParameters).cdaToken,
    space: sdk.ids.space
  });
}