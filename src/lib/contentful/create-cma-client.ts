import type { PageAppSDK } from '@contentful/app-sdk';
import { createClient } from 'contentful-management';

export function createCMAClient(sdk: PageAppSDK) {
  return createClient(
    {
      apiAdapter: sdk.cmaAdapter,
    },
    {
      type: 'plain',
      defaults: {
        spaceId: sdk.ids.space,
        environmentId: sdk.ids.environment,
      },
    },
  );
}
