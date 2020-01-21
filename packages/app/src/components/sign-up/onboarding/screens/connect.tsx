import React from 'react';
import { Flex, Box, Text, Input } from '@blockstack/ui';
import { ScreenTemplate } from '../../screen';
import { AppIcon } from '../../app-icon';
import { Link } from '../../../link';
import { doTrack, CONNECT_SAVED, CONNECT_BACK } from '../../../../common/track';
import { useSelector } from 'react-redux';
import { IAppState } from '../../../../store';
import { selectAppName } from '../../../../store/onboarding/selectors';

interface ConnectProps {
  next: () => void;
  back: () => void;
}

const Connect: React.FC<ConnectProps> = props => {
  const appName = useSelector((state: IAppState) => selectAppName(state));
  return (
    <ScreenTemplate
      textAlign="center"
      before={<AppIcon />}
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
      action={{
        label: 'Continue',
        testAttr: 'button-confirm-reenter-seed-phrase',
        onClick: () => {
          doTrack(CONNECT_SAVED);
          props.next();
        },
      }}
      footer={
        <>
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
        </>
      }
    />
  );
};

export { Connect };
