import React from 'react';
import { Text, Box } from '@blockstack/ui';
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon';
import { BoxProps } from '@blockstack/ui/dist/box';

const Title: React.FC = props => (
  <Text width="100%" fontWeight="medium" fontSize={['20px', '24px']} lineHeight={['28px', '32px']} {...props} />
);
const Body: React.FC = props => <Text fontSize="14px" lineHeight="20px" {...props} />;

const BackLink: React.FC<BoxProps> = props => (
  <Text
    display="flex"
    _hover={{ color: 'ink', textDecoration: 'underline', cursor: 'pointer' }}
    color="blue"
    fontWeight="medium"
    alignItems="center"
    {...props}
  >
    <Box>
      <ChevronLeftIcon size="1rem" />
    </Box>
    Back
  </Text>
);

export { Title, Body, BackLink };
