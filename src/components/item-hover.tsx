import { Box, BoxProps, color, transition } from '@stacks/ui';
import React from 'react';
import { useFocus, useHover } from 'use-events';

export function ItemHover({
  isFocused,
  isHovered,
  ...rest
}: {
  isFocused: boolean;
  isHovered: boolean;
} & BoxProps) {
  return (
    <Box
      opacity={isFocused || isHovered ? 1 : 0}
      transition={transition}
      borderRadius="16px"
      position="absolute"
      size="calc(100% + 24px)"
      left="-12px"
      top="-12px"
      bg={color('bg-4')}
      zIndex={-1}
      {...rest}
    />
  );
}

export function usePressable(isPressable?: boolean) {
  const [isHovered, bind] = useHover();
  const [isFocused, focusBind] = useFocus();

  const component = <ItemHover isHovered={isHovered} isFocused={isFocused} />;
  if (!isPressable) return [null, {}];
  return [component, { ...bind, ...focusBind }];
}
