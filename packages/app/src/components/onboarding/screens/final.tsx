import React from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '@store';
import { selectAppName } from '@store/onboarding/selectors';
import { Screen, ScreenBody, ScreenActions } from '@blockstack/connect';
import { AppIcon } from '../../app-icon';
import { Button } from '@blockstack/ui';

interface FinalProps {
  next: () => void;
  back: () => void;
}

export const Final: React.FC<FinalProps> = props => {
  const appName = useSelector((state: AppState) => selectAppName(state));
  return (
    <Screen textAlign="center">
      <AppIcon />
      <ScreenBody
        title={`You’re all set! ${appName} has been connected to your Data Vault`}
        body={[`Everything you do in ${appName} will be private, secure, and only accessible with your Secret Key.`]}
      />
      <ScreenActions>
        <Button width="100%" onClick={() => props.next()} data-test="button-connect-flow-finished">
          Done
        </Button>
      </ScreenActions>
    </Screen>
  );
};
