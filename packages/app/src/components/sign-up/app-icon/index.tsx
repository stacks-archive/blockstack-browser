import React from 'react';
import { Box } from '@blockstack/ui';

import { Image } from '../../image';

import { useSelector } from 'react-redux';

import { IAppState } from '../../../store';
import { selectAppName, selectAppIcon } from '../../../store/onboarding/selectors';

const AppIcon: React.FC = ({ ...rest }) => {
  const appIcon = useSelector((state: IAppState) => selectAppIcon(state));
  const appName = useSelector((state: IAppState) => selectAppName(state));
  return (
    <Box size={['48px', '78px']} mx="auto" {...rest}>
      <Image src={appIcon} alt={appName} />
    </Box>
  );
};
export { AppIcon };
