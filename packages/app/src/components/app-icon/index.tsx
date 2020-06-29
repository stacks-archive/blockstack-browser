import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { useSelector } from 'react-redux';

import { Image } from '@components/image';
import { AppState } from '@store';
import { selectAppName, selectFullAppIcon } from '@store/onboarding/selectors';

export const AppIcon = ({ ...rest }: BoxProps) => {
  const appIcon = useSelector((state: AppState) => selectFullAppIcon(state));
  const appName = useSelector((state: AppState) => selectAppName(state));
  return (
    <Box size={['48px', '78px']} mx="auto" {...rest}>
      <Image src={appIcon} alt={appName} />
    </Box>
  );
};
