import React from 'react';
import { Flex, Text, Box, BoxProps } from '@stacks/ui';
import { AssetAvatar } from '@components/stx-avatar';

interface AssetRowProps extends BoxProps {
  name: string;
  friendlyName: string;
  value: string;
  subtitle: string;
}
export const AssetRow = React.forwardRef<HTMLDivElement, AssetRowProps>((props, ref) => {
  const { name, friendlyName, value, subtitle, ...otherProps } = props;
  return (
    <Box width="100%" mb="base" {...otherProps} ref={ref}>
      <Flex flexWrap="wrap" flexDirection="row" cursor="pointer">
        <Box width="32px" py="tight" mr="base">
          <AssetAvatar
            useStx={name === 'STX' || name === 'Stacks Token'}
            gradientString={name}
            mr="tight"
            size="32px"
          >
            {friendlyName[0]}
          </AssetAvatar>
        </Box>
        <Box flexGrow={1}>
          <Text display="block" fontSize={2} fontWeight="400" color="ink.1000">
            {friendlyName}
          </Text>
          <Text fontSize={1} color="ink.400">
            {subtitle}
          </Text>
        </Box>
        <Box textAlign="right" pt="tight">
          <Text fontWeight="400" color="ink.1000">
            {value}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
});
