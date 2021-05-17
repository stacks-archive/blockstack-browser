import { Stack, StackProps } from '@stacks/ui';
import React from 'react';
import { forwardRefWithAs } from '@stacks/ui-core';

export const SpaceBetween = forwardRefWithAs<StackProps, 'div'>((props, ref) => (
  <Stack isInline alignItems="center" justifyContent="space-between" {...props} ref={ref} />
));
