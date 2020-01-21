import React from 'react';
import { ScreenTemplate } from '../../screen';
import { Collapse } from '../../collapse';
import { IAppState } from '../../../../store';

import { selectAppName } from '../../../../store/onboarding/selectors';
import { faqs } from '../data';

import { doTrack, SECRET_KEY_INSTR_CONFIRMED } from '../../../../common/track';

import { useSelector } from 'react-redux';

interface SaveKeyProps {
  next: () => void;
}

const SaveKey: React.FC<SaveKeyProps> = ({ next }) => {
  const appName = useSelector((state: IAppState) => selectAppName(state));
  return (
    <ScreenTemplate
      title="Save your Secret Key"
      body={[
        'Paste your Secret Key wherever you keep critical, private, information such as passwords.',
        'Once lost, it’s lost forever. So save it somewhere you won’t forget.',
      ]}
      action={{
        label: "I've saved it",
        testAttr: 'button-has-saved-seed-phrase',
        onClick: () => {
          doTrack(SECRET_KEY_INSTR_CONFIRMED);
          next();
        },
      }}
      after={<Collapse data={faqs(appName as string)} />}
    />
  );
};

export { SaveKey };
