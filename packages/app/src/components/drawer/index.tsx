import React from 'react';
import { Box, Flex, Stack, Button, Text } from '@blockstack/ui';
import { ScreenBody, ScreenActions, Title } from '@blockstack/connect';
import useOnClickOutside from 'use-onclickoutside';

import { Image } from '@components/image';
import { ConfigApp } from '@blockstack/keychain';

interface PreviousAppsProps {
  apps: ConfigApp[];
}

const PreviousApps = ({ apps, ...rest }: PreviousAppsProps) => (
  <Flex mx={6} {...rest}>
    {apps.map((app, key) => (
      <Box border="2px solid white" size="26px" borderRadius="6px" key={key} overflow="hidden">
        <Image src={app.appIcon} alt={app.name} title={app.name} />
      </Box>
    ))}
  </Flex>
);

const transition = '0.2s all ease-in-out';

interface DrawerProps {
  showing: boolean;
  close: () => void;
  apps: ConfigApp[];
  confirm: (hideWarning: boolean) => Promise<void>;
}

export const Drawer: React.FC<DrawerProps> = ({ showing, close, apps, confirm }) => {
  const ref = React.useRef(null);
  const [checked, setChecked] = React.useState(false);

  useOnClickOutside(ref, () => showing && close());

  return (
    <Flex
      bg={`rgba(0,0,0,0.${showing ? 4 : 0})`}
      transition={transition}
      position="fixed"
      height="100%"
      width="100%"
      align="flex-end"
      dir="column"
      zIndex={1000}
      style={{
        pointerEvents: !showing ? 'none' : 'unset',
        userSelect: !showing ? 'none' : 'unset',
        willChange: 'background',
      }}
    >
      <Box
        ref={ref}
        opacity={showing ? 1 : 0}
        transform={showing ? 'none' : 'translateY(35px)'}
        transition={showing ? transition + ' 0.1s' : transition}
        style={{ willChange: 'transform, opacity' }}
        width="100%"
        bg="white"
        py={6}
        borderTopLeftRadius="24px"
        borderTopRightRadius="24px"
      >
        <Stack spacing={4}>
          <PreviousApps apps={apps} />
          <ScreenBody
            body={[
              <Title>
                You{"'"}re using this account with {apps.length} other app
                {apps.length > 1 ? 's' : ''}.
              </Title>,
              <Text display="block" mt={3}>
                The apps used by an account is public information. If you want your use of this app
                to be private, consider choosing a different account or creating a new account.
              </Text>,
              <>
                <Flex mt={4} align="center">
                  <Box mr={2}>
                    <input
                      name="checkbox"
                      id="checkbox"
                      type="checkbox"
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                    />
                  </Box>
                  <label htmlFor="checkbox">Do not show this again</label>
                </Flex>
              </>,
            ]}
          />
          <ScreenActions mt={2}>
            <Stack width="100%" isInline spacing={3}>
              <Button mode="secondary" onClick={close} flexGrow={1}>
                Go back
              </Button>
              <Button flexGrow={1} onClick={async () => await confirm(checked)}>
                Continue to app
              </Button>
            </Stack>
          </ScreenActions>
        </Stack>
      </Box>
    </Flex>
  );
};
