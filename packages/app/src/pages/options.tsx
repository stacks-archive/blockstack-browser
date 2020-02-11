import React from 'react';
import { Flex, ThemeProvider, theme, CSSReset } from '@blockstack/ui';
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

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Flex wrap="wrap" py={5} px={4} flexDirection="column" height="100vh">
        <LogoWithName />
        <Flex flex={1} mt={10} justifyContent={[null, 'center']}>
          {identities.length > 0 && (
            <SignOut
              identities={identities}
              signOut={() => {
                dispatch(doSignOut());
              }}
            />
          )}
        </Flex>
      </Flex>
    </ThemeProvider>
  );
};
