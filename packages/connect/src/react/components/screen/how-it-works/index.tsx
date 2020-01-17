import React from 'react';
import { ScreenTemplate } from '../index';
import { Box, Text, Stack } from '@blockstack/ui';
import { useAppDetails } from '../../../hooks/useAppDetails';
import { BlockchainIcon, AppsIcon, EncryptionIcon } from '../../vector';
import { useConnect } from '../../../hooks/useConnect';

const howDataVaultWorks = (appName: string) => [
  {
    body: `Usually, apps store your data on their servers for their own use. Data Vault isolates your encrypted data from use by others so that apps like ${appName} (and even Data Vault) can’t use it.`,
  },
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

const HowItWorks: React.FC = () => {
  const { name } = useAppDetails();
  const { authenticate, authOptions } = useConnect();

  return (
    <>
      <ScreenTemplate
        pretitle="How it works"
        title={`Data Vault keeps what you do in ${name} private`}
        body={howDataVaultWorks(name).map(({ title, body, icon: Icon }, key) => (
          <Box px={5} key={key}>
            <Stack spacing={3}>
              {Icon && (
                <Box size="24px" color="blue" borderRadius="8px">
                  {Icon && Icon}
                </Box>
              )}
              {title && <Text fontWeight="semibold">{title}</Text>}
              <Text pb={2}>{body}</Text>
            </Stack>
          </Box>
        ))}
        action={{
          label: 'Create your Data Vault',
          onClick: () => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            authenticate(authOptions);
          },
        }}
      />
    </>
  );
};

export { HowItWorks };
