import React from 'react';
import { Text } from '@blockstack/ui';

const Title: React.FC = props => (
  <Text width="95%" fontWeight="medium" fontSize="24px" lineHeight="32px" display="inline-block" {...props} />
);

const Pretitle: React.FC = props => (
  <Text
    pt={6}
    width="100%"
    fontWeight="medium"
    fontSize={['11px']}
    lineHeight={['20px']}
    color="ink.600"
    style={{
      textTransform: 'uppercase',
    }}
    {...props}
  />
);
const Body: React.FC = props => <Text fontSize="14px" lineHeight="20px" {...props} />;

export { Pretitle, Title, Body };
