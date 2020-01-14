import React from 'react';
import { Flex, Box, Text, Stack } from '@blockstack/ui';
import CheckIcon from 'mdi-react/CheckIcon';

/**
 * This renders a list of items with a checkmark to their left
 */

const Checkmark: React.FC = props => (
  <Box transform="translateY(-2px)" color="ink.300" mr={2} pt={1} {...props}>
    <CheckIcon size={18} />
  </Box>
);

const Item: React.FC = ({ children }) => (
  <Text fontSize="14px" color="ink.600">
    {children}
  </Text>
);

interface CheckListProps {
  items: string[];
}

const CheckList: React.FC<CheckListProps> = ({ items, ...rest }) => (
  <Stack spacing={3} {...rest}>
    {items.map((text, key) => (
      <Flex align="flex-start" textAlign="left" key={key}>
        <Checkmark />
        <Item>{text}</Item>
      </Flex>
    ))}
  </Stack>
);

export { CheckList };
