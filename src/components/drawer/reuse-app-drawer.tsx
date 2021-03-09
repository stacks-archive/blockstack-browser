import React from 'react';
import { Box, Flex, Stack, Button, Text } from '@stacks/ui';
import { ScreenBody, ScreenActions } from '@screen';
import { Title } from '@components/typography';
import { BaseDrawer, BaseDrawerProps } from './index';

import { Image } from '@components/image';
import { ConfigApp } from '@stacks/wallet-sdk';

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

interface ReuseAppDrawerProps extends BaseDrawerProps {
  apps: ConfigApp[];
  confirm: (hideWarning: boolean) => Promise<void>;
}

export const ReuseAppDrawer: React.FC<ReuseAppDrawerProps> = ({
  showing,
  close,
  apps,
  confirm,
}) => {
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onClose = () => {
    if (showing) {
      setLoading(false);
      close();
    }
  };

  return (
    <BaseDrawer showing={showing} close={onClose}>
      <PreviousApps apps={apps} />
      <ScreenBody
        body={[
          <Title>
            You{"'"}re using this account with {apps.length} other app
            {apps.length > 1 ? 's' : ''}.
          </Title>,
          <Text display="block" mt={3}>
            The apps used by an account is public information. If you want your use of this app to
            be private, consider choosing a different account or creating a new account.
          </Text>,
          <>
            <Flex mt={4} alignItems="center">
              <Box mr={2}>
                <input
                  name="checkbox"
                  id="checkbox"
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />
              </Box>
              <label htmlFor="checkbox" style={{ cursor: 'pointer' }}>
                Do not show this again
              </label>
            </Flex>
          </>,
        ]}
      />
      <ScreenActions mt={2}>
        <Stack width="100%" isInline spacing={3}>
          <Button mode="secondary" onClick={close} flexGrow={1}>
            Go back
          </Button>
          <Button
            data-test="confirm-continue-app"
            flexGrow={1}
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              await confirm(checked);
            }}
          >
            Continue to app
          </Button>
        </Stack>
      </ScreenActions>
    </BaseDrawer>
  );
};
