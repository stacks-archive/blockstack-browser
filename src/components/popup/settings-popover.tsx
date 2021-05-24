import React, { memo, useCallback } from 'react';
import { Box, SlideFade, BoxProps, color, Flex } from '@stacks/ui';
import { Text, Caption } from '@components/typography';
import useOnClickOutside from '@common/hooks/use-onclickoutside';
import { useWallet } from '@common/hooks/use-wallet';
import { useDrawers } from '@common/hooks/use-drawers';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { ScreenPaths } from '@store/common/types';
import { AccountStep } from '@store/ui';
import { Divider } from '@components/divider';
import { USERNAMES_ENABLED } from '@common/constants';
import { forwardRefWithAs } from '@stacks/ui-core';

const MenuWrapper = forwardRefWithAs((props, ref) => (
  <Box
    ref={ref}
    position="absolute"
    top="60px"
    right="extra-loose"
    borderRadius="8px"
    width="296px"
    boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08);"
    zIndex={2000}
    border="1px solid"
    bg={color('bg')}
    borderColor={color('border')}
    py="tight"
    transformOrigin="top right"
    {...props}
  />
));

const MenuItem: React.FC<BoxProps> = memo(props => {
  const { onClick, children, ...rest } = props;
  return (
    <Text
      {...rest}
      width="100%"
      px="base"
      py="base-tight"
      cursor="pointer"
      color={color('text-title')}
      _hover={{ backgroundColor: color('bg-4') }}
      onClick={e => {
        onClick?.(e);
      }}
      fontSize={1}
    >
      {children}
    </Text>
  );
});

export const SettingsPopover: React.FC = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const {
    doSignOut,
    currentAccount,
    doLockWallet,
    wallet,
    currentNetworkKey,
    isSignedIn,
    encryptedSecretKey,
  } = useWallet();
  const { setShowNetworks, setShowAccounts, setAccountStep, setShowSettings, showSettings } =
    useDrawers();
  const doChangeScreen = useDoChangeScreen();

  const handleClose = useCallback(() => {
    setShowSettings(false);
  }, [setShowSettings]);

  const wrappedCloseCallback = useCallback(
    (callback: () => void) => () => {
      callback();
      handleClose();
    },
    [handleClose]
  );

  const isShowing = showSettings;

  useOnClickOutside(ref, isShowing ? handleClose : null);

  return (
    <SlideFade initialOffset="-20px" timeout={150} in={isShowing}>
      {styles => (
        <MenuWrapper ref={ref} style={styles} pointerEvents={!isShowing ? 'none' : 'all'}>
          {isSignedIn && (
            <>
              {wallet && wallet?.accounts?.length > 1 && (
                <MenuItem
                  onClick={wrappedCloseCallback(() => {
                    setAccountStep(AccountStep.Switch);
                    setShowAccounts(true);
                  })}
                >
                  Switch account
                </MenuItem>
              )}
              <MenuItem
                data-test="settings-create-an-account"
                onClick={wrappedCloseCallback(() => {
                  setAccountStep(AccountStep.Create);
                  setShowAccounts(true);
                })}
              >
                Create an Account
              </MenuItem>
              <MenuItem
                onClick={wrappedCloseCallback(() => {
                  doChangeScreen(ScreenPaths.SETTINGS_KEY);
                })}
              >
                View Secret Key
              </MenuItem>
            </>
          )}
          {USERNAMES_ENABLED && currentAccount && !currentAccount.username ? (
            <>
              <Divider />
              <MenuItem
                onClick={wrappedCloseCallback(() => {
                  setAccountStep(AccountStep.Username);
                  setShowAccounts(true);
                })}
              >
                Add username
              </MenuItem>
            </>
          ) : null}
          {isSignedIn ? <Divider /> : null}
          <MenuItem
            onClick={wrappedCloseCallback(() => {
              setShowNetworks(true);
            })}
          >
            <Flex width="100%" alignItems="center" justifyContent="space-between">
              <Box>Change Network</Box>
              <Caption>{currentNetworkKey}</Caption>
            </Flex>
          </MenuItem>
          {encryptedSecretKey && (
            <>
              <Divider />
              {isSignedIn && (
                <MenuItem
                  onClick={wrappedCloseCallback(() => {
                    void doLockWallet();
                    doChangeScreen(ScreenPaths.POPUP_HOME);
                  })}
                  data-test="settings-lock"
                >
                  Lock
                </MenuItem>
              )}
              <MenuItem
                onClick={wrappedCloseCallback(() => {
                  void doSignOut();
                  doChangeScreen(ScreenPaths.INSTALLED);
                })}
                data-test="settings-sign-out"
              >
                Sign Out
              </MenuItem>
            </>
          )}
        </MenuWrapper>
      )}
    </SlideFade>
  );
};
