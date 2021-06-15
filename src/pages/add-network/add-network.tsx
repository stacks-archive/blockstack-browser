import React, { useState } from 'react';
import { Box, Text, Input, InputGroup, Button } from '@stacks/ui';
import { Formik } from 'formik';
import { useSetRecoilState } from 'recoil';
import { currentNetworkKeyState, networksState } from '@store/networks';
import { PopupContainer } from '@components/popup/container';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { ScreenPaths } from '@store/common/types';
import { isValidUrl } from '@common/validation/validate-url';
import { ChainID, fetchPrivate } from '@stacks/transactions';
import { ErrorLabel } from '@components/error-label';
import { Header } from '@components/header';

export const AddNetwork: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const doChangeScreen = useDoChangeScreen();
  const setNetworks = useSetRecoilState(networksState);
  const setNetworkKey = useSetRecoilState(currentNetworkKeyState);

  return (
    <PopupContainer
      header={
        <Header title="Add a network" onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)} />
      }
    >
      <Box mt="base">
        <Text fontSize={2}>
          Use this form to add a new instance of the{' '}
          <a href="https://github.com/blockstack/stacks-blockchain-api" target="_blank">
            Stacks Blockchain API
          </a>
          . Make sure you review and trust the host before you add it.
        </Text>
      </Box>
      <Formik
        initialValues={{ name: '', url: '', key: '' }}
        onSubmit={async values => {
          const { name, url, key } = values;
          if (!isValidUrl(url)) {
            setError('Please enter a valid URL');
            return;
          }
          setLoading(true);
          setError('');
          try {
            const origin = new URL(url).origin;
            const response = await fetchPrivate(`${origin}/v2/info`);
            const chainInfo = await response.json();
            const networkId = chainInfo?.network_id && parseInt(chainInfo?.network_id);
            if (networkId === ChainID.Mainnet || networkId === ChainID.Testnet) {
              setNetworks(networks => {
                return {
                  ...networks,
                  [key]: {
                    url: origin,
                    name,
                    chainId: networkId,
                  },
                };
              });
              setNetworkKey(key);
              doChangeScreen(ScreenPaths.POPUP_HOME);
              return;
            }
            setError('Unable to determine chainID from node.');
          } catch (error) {
            setError('Unable to fetch info from node.');
          }
          setLoading(false);
        }}
      >
        {({ handleSubmit, values, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <Box width="100%" mt="extra-loose">
              <InputGroup flexDirection="column">
                <Text
                  as="label"
                  display="block"
                  mb="tight"
                  fontSize={1}
                  fontWeight="500"
                  htmlFor="name"
                >
                  Name
                </Text>
                <Input
                  display="block"
                  width="100%"
                  value={values.name}
                  onChange={handleChange}
                  name="name"
                />
              </InputGroup>
            </Box>
            <Box width="100%" mt="extra-loose">
              <InputGroup flexDirection="column">
                <Text
                  as="label"
                  display="block"
                  mb="tight"
                  fontSize={1}
                  fontWeight="500"
                  htmlFor="url"
                >
                  Address
                </Text>
                <Input
                  display="block"
                  width="100%"
                  value={values.url}
                  onChange={handleChange}
                  name="url"
                />
              </InputGroup>
            </Box>
            <Box width="100%" mt="extra-loose">
              <InputGroup flexDirection="column">
                <Text
                  as="label"
                  display="block"
                  mb="tight"
                  fontSize={1}
                  fontWeight="500"
                  htmlFor="key"
                >
                  Key
                </Text>
                <Input
                  display="block"
                  width="100%"
                  value={values.key}
                  onChange={handleChange}
                  name="key"
                />
              </InputGroup>
            </Box>
            {error ? (
              <ErrorLabel>
                <Text textStyle="caption">{error}</Text>
              </ErrorLabel>
            ) : null}
            <Box mt="loose">
              <Button width="100%" isDisabled={loading} isLoading={loading}>
                Add network
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </PopupContainer>
  );
};
