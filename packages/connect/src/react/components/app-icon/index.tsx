import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { Image } from '../image';

interface AppIconProps {
  src: string;
  alt: string;
}

const AppIcon: React.FC<AppIconProps & BoxProps> = ({ src, alt, ...rest }) => (
  <Box borderRadius="6px" overflow="hidden" size={6} {...rest}>
    <Image src={src} alt={alt} title={alt} loading="lazy" />
  </Box>
);

export { AppIcon };
