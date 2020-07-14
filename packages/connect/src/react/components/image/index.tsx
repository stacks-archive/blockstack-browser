import React from 'react';
import { BoxProps, Box } from '@blockstack/ui';

interface ImageProps extends BoxProps {
  src?: string;
  alt?: string;
  title?: string;
  loading?: 'eager' | 'lazy' | undefined;
}

const Image: React.FC<ImageProps> = ({ loading: _loading, ...props }) => {
  return (
    <Box
      as="img"
      style={{
        maxWidth: '100%',
        display: 'block',
      }}
      {...props}
    />
  );
};

export { Image };
