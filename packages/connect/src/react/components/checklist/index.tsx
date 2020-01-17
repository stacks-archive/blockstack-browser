import React from 'react';
import { Flex, Box, Text } from '@blockstack/ui';

const Item: React.FC = ({ children }) => (
  <Text fontSize="14px" color="ink.900">
    {children}
  </Text>
);
type Item = {
  icon: any;
  text: any;
};
interface CheckListProps {
  items: Item[];
}

const CheckList: React.FC<CheckListProps> = ({ items }) => (
  <>
    {items.map((item, key) => {
      const Icon = item.icon;
      const { text } = item;
      return (
        <Flex
          px={5}
          pb={3}
          pt={key === 0 ? 0 : 3}
          borderBottom={items.length - 1 !== key ? '1px solid' : 'unset'}
          borderColor="inherit"
          align="center"
          textAlign="left"
          key={key}
        >
          <Box color="blue" pr={3}>
            <Icon />
          </Box>
          <Item>{text}</Item>
        </Flex>
      );
    })}
  </>
);

export { CheckList };
