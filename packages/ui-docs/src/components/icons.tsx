import {
  Grid,
  Flex,
  Box,
  AppsIcon,
  BlockchainIcon,
  BlockstackIcon,
  CheckmarkCircleIcon,
  CheckmarkIcon,
  ChevronIcon,
  CloseIcon,
  ConnectLogoIcon,
  EncryptionIcon,
  ExclamationMarkCircleIcon,
  ExclamationMarkIcon,
  EyeIcon,
  PadlockIcon,
  PlusCircleIcon,
  PrivateIcon,
  UnionLineIcon,
  ArrowIcon,
  space,
} from '@blockstack/ui';

import { InlineCode } from '@components/mdx';

const Components = {
  AppsIcon,
  ArrowIcon,
  BlockchainIcon,
  BlockstackIcon,
  CheckmarkCircleIcon,
  CheckmarkIcon,
  ChevronIcon,
  CloseIcon,
  ConnectLogoIcon,
  EncryptionIcon,
  ExclamationMarkCircleIcon,
  ExclamationMarkIcon,
  EyeIcon,
  PadlockIcon,
  PlusCircleIcon,
  PrivateIcon,
  UnionLineIcon,
};

export type ComponentNamesLiteral = keyof typeof Components;

const strings: ComponentNamesLiteral[] = [
  'AppsIcon',
  'ArrowIcon',
  'BlockchainIcon',
  'BlockstackIcon',
  'CheckmarkCircleIcon',
  'CheckmarkIcon',
  'ChevronIcon',
  'CloseIcon',
  'ConnectLogoIcon',
  'EncryptionIcon',
  'ExclamationMarkCircleIcon',
  'ExclamationMarkIcon',
  'EyeIcon',
  'PadlockIcon',
  'PlusCircleIcon',
  'PrivateIcon',
  'UnionLineIcon',
];

export const Icons = () => {
  return (
    <Grid
      my={space('extra-loose')}
      templateColumns={['repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
      gap={space('extra-loose')}
    >
      {strings.map(icon => {
        const Component = Components[icon];

        return (
          <Flex flexDirection="column" align="center" justify="center">
            <Box mb={space('base-loose')}>
              <Component size={['36px', '36px', '48px']} />
            </Box>
            <InlineCode fontSize="10px" style={{ whiteSpace: 'pre' }}>{`<${icon} />`}</InlineCode>
          </Flex>
        );
      })}
    </Grid>
  );
};
