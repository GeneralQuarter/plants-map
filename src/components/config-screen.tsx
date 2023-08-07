import { ConfigAppSDK } from '@contentful/app-sdk';
import { Flex, Form, FormControl, Heading, TextInput } from '@contentful/f36-components';
import { useSDK } from '@contentful/react-apps-toolkit';
import { css } from 'emotion';
import { useCallback, useEffect, useState } from 'react';

export interface AppInstallationParameters {
  cdaToken: string;
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({cdaToken: ''});
  const sdk = useSDK<ConfigAppSDK>();

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();

    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
    <Flex flexDirection="column" className={css({ margin: '80px', maxWidth: '800px' })}>
      <Form className={css({ width: '500px', margin: '80px' })}>
        <Heading marginBottom="none">Plants Map</Heading>
        <FormControl id="cda-access-token" isRequired>
          <FormControl.Label>CDA Access Token</FormControl.Label>
          <TextInput
            name="cda-access-token"
            value={parameters.cdaToken}
            onChange={evt => setParameters({...parameters, cdaToken: evt.target.value})} />
          <FormControl.HelpText>Please enter CDA Access Token</FormControl.HelpText>
        </FormControl>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
