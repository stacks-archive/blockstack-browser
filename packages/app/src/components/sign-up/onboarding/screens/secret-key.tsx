import React from 'react';
import { Toast } from '../../toast';
import { ScreenTemplate } from '../../screen';

import { Card } from '../../card';
import { SeedTextarea } from '../../seed-textarea';

import { doTrack, SECRET_KEY_INTRO_COPIED } from '../../../../common/track';

import { useSelector } from 'react-redux';

import { IAppState } from '../../../../store';
import { selectSecretKey } from '../../../../store/onboarding/selectors';

interface SecretKeyProps {
  next: () => void;
}

const SecretKey: React.FC<SecretKeyProps> = props => {
  const { secretKey } = useSelector((state: IAppState) => ({
    secretKey: selectSecretKey(state),
  }));
  const [copied, setCopiedState] = React.useState(false);

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        props.next();
      }, 2500);
    }
  });

  return (
    <>
      <ScreenTemplate
        title="Your Secret Key"
        appIcon
        body={[
          'Your Data Vault has a Secret Key: 12 words that unlock it, like the key to your home. Once lost, it’s lost forever. So save it somewhere you won’t forget.',
          <Card title="Your Secret Key">
            <SeedTextarea readOnly value={secretKey} className="hidden-secret-key" data-test="textarea-seed-phrase" />
          </Card>,
        ]}
        action={{
          label: 'Copy Secret Key',
          testAttr: 'button-copy-secret-key',
          onClick: () => {
            doTrack(SECRET_KEY_INTRO_COPIED);
            const input: HTMLInputElement = document.querySelector('.hidden-secret-key') as HTMLInputElement;
            input.select();
            input.setSelectionRange(0, 99999);
            document.execCommand('copy');
            setCopiedState(true);
          },
          disabled: copied,
        }}
      />
      <Toast show={copied} />
    </>
  );
};

export { SecretKey };
