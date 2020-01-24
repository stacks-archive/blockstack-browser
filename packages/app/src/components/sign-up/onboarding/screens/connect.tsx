import React from 'react';
import { Flex, Box, Text, Input } from '@blockstack/ui';
import { AppIcon } from '../../app-icon';
import { Link } from '../../../link';
import { doTrack, CONNECT_SAVED, CONNECT_BACK } from '../../../../common/track';
import { useSelector } from 'react-redux';
import { IAppState } from '../../../../store';
import { selectAppName } from '../../../../store/onboarding/selectors';
import { ScreenHeader } from '../../header';
import { ScreenBody, ScreenActions, ScreenFooter, Screen } from '../../screen';

interface ConnectProps {
  next: () => void;
  back: () => void;
}

export const Connect: React.FC<ConnectProps> = props => {
  const appName = useSelector((state: IAppState) => selectAppName(state));
  return (
    <Screen textAlign="center">
      <ScreenHeader appIcon />
      <AppIcon />
      <ScreenBody
        title={`Connect ${appName} to your Data Vault`}
        body={[
          'Enter your Secret Key to continue.',
          <Box>
            {/*Validate, track: CONNECT_INCORRECT */}
            <Input
              autoFocus
              minHeight="80px"
              placeholder="12-word Secret Key"
              data-test="textarea-reinput-seed-phrase"
              as="textarea"
            />
          </Box>,
        ]}
      />
      <ScreenActions
        action={{
          label: 'Continue',
          testAttr: 'button-confirm-reenter-seed-phrase',
          onClick: () => {
            doTrack(CONNECT_SAVED);
            props.next();
          },
        }}
      />
      <ScreenFooter>
        <Flex>
          <Text>Didn’t save your Secret Key?</Text>{' '}
          <Link
            onClick={() => {
              doTrack(CONNECT_BACK);
              props.back();
            }}
            pl={1}
            color="blue"
          >
            Go Back
          </Link>
        </Flex>
        <Link>Help</Link>
      </ScreenFooter>
    </Screen>
  );
};
