import React from 'react';
import { Box, BoxProps, Text } from '@blockstack/ui';

interface CardProps extends BoxProps {
  title: string;
}

const Card: React.FC<CardProps> = ({ title, children, ...rest }) => {
  return (
    <Box
      borderRadius="6px"
      border="1px solid"
      borderColor="#E5E5EC"
      boxShadow="mid"
      textAlign="center"
      {...rest}
    >
      <Box borderBottom="1px solid" borderColor="#E5E5EC" p={3}>
        <Text textStyle="caption" color="ink.600">
          {title}
        </Text>
      </Box>
      <Box px={10} py={5}>
        <Text>{children}</Text>
      </Box>
    </Box>
  );
};

export { Card };
