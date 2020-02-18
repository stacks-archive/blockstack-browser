import React from 'react';
import { Box, Flex, Text, ThemeProvider, theme, CSSReset } from '@blockstack/ui';
import { useSelector, useDispatch } from 'react-redux';
import { selectIdentities } from '@store/wallet/selectors';
import { AppState } from '../store/index';
import { LogoWithName } from '@components/logo-with-name';
import { doSignOut } from '@store/wallet';
import { SignOut } from '@components/sign-out';

export const OptionsApp = () => {
  const { identities } = useSelector((state: AppState) => ({
    identities: selectIdentities(state),
  }));
  const dispatch = useDispatch();

  const isSignedIn = identities.length > 0;

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Flex wrap="wrap" py={5} px={4} flexDirection="column" height="100vh">
        <LogoWithName />
        <Flex flex={1} mt={10} justifyContent={[null, 'center']}>
          {isSignedIn ? (
            <SignOut
              maxWidth={[null, '396px']}
              buttonMode="secondary"
              identities={identities}
              signOut={() => {
                dispatch(doSignOut());
              }}
            />
          ) : (
            <Flex flexDirection="column" pb="120px" align="center" justify="center" flexGrow={1}>
              <Box>
                <Text fontSize="20px" lineHeight="28px" fontWeight="500">
                  You&apos;re signed out of Secret Key
                </Text>
              </Box>
              <Box pt={2}>
                <Text fontSize="14px" lineHeight="20px" color="blue" position="relative">
                  <a
                    href="https://app.co/blockstack"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Find an app to use"
                    style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '100%' }}
                  />
                  Find an app to use
                </Text>
              </Box>
            </Flex>
          )}
        </Flex>
      </Flex>
    </ThemeProvider>
  );
};
