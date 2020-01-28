import React from 'react';
import { useSelector } from 'react-redux';
import { Screen, ScreenBody, ScreenActions } from '@blockstack/connect';
import { Button } from '@blockstack/ui';

import { Collapse } from '../../collapse';
import { AppState } from '../../../../store';

import { selectAppName } from '../../../../store/onboarding/selectors';
import { faqs } from '../data';

import { doTrack, SECRET_KEY_INSTR_CONFIRMED } from '../../../../common/track';

import { ScreenHeader } from '../../header';

interface SaveKeyProps {
  next: () => void;
}

export const SaveKey: React.FC<SaveKeyProps> = ({ next }) => {
  const appName = useSelector((state: AppState) => selectAppName(state));
  return (
    <Screen>
      <ScreenHeader appIcon />
      <ScreenBody
        title="Save your Secret Key"
        body={[
          'Paste your Secret Key wherever you keep critical, private, information such as passwords.',
          'Once lost, it’s lost forever. So save it somewhere you won’t forget.',
        ]}
      />
      <ScreenActions>
        <Button
          width="100%"
          onClick={() => {
            doTrack(SECRET_KEY_INSTR_CONFIRMED);
            next();
          }}
          data-test="button-has-saved-seed-phrase"
        >
          {"I've saved it"}
        </Button>
      </ScreenActions>
      <Collapse data={faqs(appName as string)} />
    </Screen>
  );
};
