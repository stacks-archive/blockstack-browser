import { Stack, StackProps } from '@stacks/ui';
import React from 'react';

export const SpaceBetween: React.FC<StackProps> = props => (
  <Stack isInline alignItems="center" justifyContent="space-between" {...props} />
);
