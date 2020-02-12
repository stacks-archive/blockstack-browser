import React from 'react';
import { Box, Text, Button } from '@blockstack/ui';
import { useAppDetails } from '../../hooks/use-app-details';
import { useConnect } from '../../hooks/use-connect';
import { Title } from '../typography';
import { Screen, ScreenBody, ScreenActions, ScreenFooter } from '../screen/index';
import { Link } from '../link';
import { PoweredBy } from '../powered-by';

interface InfoSection {
  title: string;
  body: string | JSX.Element;
}

const howSecretKeyWorks = ({ name }: { name: string }): InfoSection[] => [
  {
    title: 'What is Blockstack?',
    body: (
      <span>
        Blockstack is the open-source technology that generates your Secret Key. There&apos;s no company that owns or
        controls Blockstack, it is independent. Go to{' '}
        <Link color="blue" display="inline-block" onClick={() => window.open('https://blockstack.org', '_blank')}>
          blockstack.org
        </Link>{' '}
        to learn more.
      </span>
    ),
  },
  {
    title: 'Encryption',
    body: `Encryption is always on. It locks everything you do in ${name} into useless codes. Because of this, Instagram can’t see or track your activity. Your data can only be unlocked with the key that you own. No one else has this key, not even ${name}, so no one else can unlock your data`,
  },
  {
    title: 'What is a Secret Key?',
    body: `Your Secret Key unlocks your data. It's created independently from ${name} to make sure that ${name} doesn't have it. An open-source protocol called Blockstack generates your Secret Key when you sign up. Nobody but you will have your Secret Key, to make sure that only you have access to your data.`,
  },
  {
    title: 'When will I need my Secret Key?',
    body:
      'You’ll need your Secret Key to prove it’s you when you use Instagram on a new device, such as a new phone or laptop. After that, your Secret Key will stay active to keep you safe and private in the apps you use on that device.',
  },
];

export const HowItWorks: React.FC = () => {
  const { name } = useAppDetails();
  const { doAuth } = useConnect();

  return (
    <Screen>
      <ScreenBody
        pretitle="How it works"
        body={[
          <Title>{name} keeps everything you do private with Blockstack&apos;s Secret Key technology</Title>,
          <Text mt={2} display="block">
            Normally, apps keep your data for them to use. When you have a Secret Key, you no longer have to trust{' '}
            {name} with your data because {name} won&apos;t have access.
          </Text>,
          <Box mt={2}>
            {howSecretKeyWorks({ name }).map(({ title, body }, key) => (
              <Box mt={8} key={key}>
                <Text mt={3} display="block" fontWeight="semibold">
                  {title}
                </Text>
                <Text mt={2} display="block">
                  {body}
                </Text>
              </Box>
            ))}
          </Box>,
        ]}
      />
      <ScreenActions>
        <Button width="100%" size="md" mt={6} onClick={() => doAuth()}>
          Get Started
        </Button>
      </ScreenActions>
      <ScreenFooter>
        <PoweredBy />
      </ScreenFooter>
    </Screen>
  );
};
