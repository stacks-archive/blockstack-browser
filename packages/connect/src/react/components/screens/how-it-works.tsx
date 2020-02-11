import React from 'react';
import { Box, Text, Button } from '@blockstack/ui';

import { useAppDetails } from '../../hooks/useAppDetails';
import { BlockchainIcon, AppsIcon, EncryptionIcon } from '../vector';
import { useConnect } from '../../hooks/useConnect';
import { Title } from '../typography';

import { Screen, ScreenBody, ScreenActions } from '../screen/index';

const howDataVaultWorks = [
  {
    icon: <EncryptionIcon />,
    title: 'Encryption',
    body:
      'Data Vault’s encryption locks your app data into codes that only you can open using a Secret Key that you control. This lock and key keeps everything you do private.',
  },
  {
    icon: <BlockchainIcon />,
    title: 'Blockchain technology',
    body:
      'The Secret Key to your Data Vault is made using a blockchain. The blockchain ensures that only you have the key and that no one can take it from you. Your data is private, for your own use, and safe from misuse by app creators.',
  },
  {
    icon: <AppsIcon />,
    title: 'Over 300 apps use Data Vault',
    body: 'Data Vault is free to use with over 300 apps.',
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
          <Title>Data Vault keeps what you do in {name} private</Title>,
          <Text mt={2} display="block">
            Usually, apps store your data on their servers for their own use. Data Vault isolates your encrypted data
            from use by others so that apps like {name} (and even Data Vault) can’t use it.
          </Text>,
          <Box mt={2}>
            {howDataVaultWorks.map(({ title, body, icon }, key) => (
              <Box mt={8} key={key}>
                <Box size="24px" color="blue" borderRadius="8px">
                  {icon}
                </Box>
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
          Create your Data Vault
        </Button>
      </ScreenActions>
    </Screen>
  );
};
