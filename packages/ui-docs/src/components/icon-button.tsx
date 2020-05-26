import React, { forwardRef, Ref } from 'react';
import { Box } from '@blockstack/ui';
import { color } from '@components/color-modes';
import { LinkProps } from '@components/typography';

export const IconButton = forwardRef((props: LinkProps, ref: Ref<HTMLDivElement>) => (
  <Box
    p="tight"
    borderRadius="4px"
    _hover={{ bg: color('bg-alt'), cursor: 'pointer' }}
    color={color('invert')}
    ref={ref}
    {...props}
  />
));
