import React, { memo } from 'react';
import { Stack, StackProps, color, Box, BoxProps } from '@stacks/ui';
import { Title } from '@components/typography';

const HiroSvg: React.FC<BoxProps> = props => (
  <Box as="svg" viewBox="0 0 16 16" fill="none" {...props}>
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path
      d="M9.17128 9.07053L10.4458 11H9.4937L7.99748 8.733L6.50126 11H5.55416L6.82872 9.07557H5V8.34509H11V9.07053H9.17128Z"
      fill={color('bg')}
    />
    <path
      d="M11 6.90428V7.63476V7.6398H5V6.90428H6.79345L5.53401 5H6.48615L7.99748 7.29723L9.51385 5H10.466L9.20655 6.90428H11Z"
      fill={color('bg')}
    />
  </Box>
);

export const StacksWalletLogo: React.FC<StackProps> = memo(props => {
  return (
    <Stack
      color={color('text-title')}
      cursor="pointer"
      flexDirection="row"
      isInline
      alignItems="center"
      _hover={{ color: color('brand') }}
      {...props}
    >
      <HiroSvg size="23px" />
      <Title lineHeight="1rem" fontSize={2} fontWeight={500}>
        Hiro Wallet
      </Title>
    </Stack>
  );
});
