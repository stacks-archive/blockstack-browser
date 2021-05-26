import React from 'react';
import { Box, BoxProps } from '@stacks/ui';

import { Image } from '@components/image';
import { useAppDetails } from '@common/hooks/auth/use-app-details';

export const AppIcon: React.FC<BoxProps> = ({ ...rest }) => {
  const { name, icon } = useAppDetails();
  return (
    <Box size={'24px'} mx="auto" {...rest}>
      <Image src={icon} alt={name} />
    </Box>
  );
};
