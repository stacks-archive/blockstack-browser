import React from 'react';

interface ImageProps {
  src?: string;
  alt?: string;
  title?: string;
  loading?: 'eager' | 'lazy' | undefined;
}

const Image: React.FC<ImageProps> = ({ loading: _loading, ...props }) => {
  return (
    <img
      style={{
        maxWidth: '100%',
        display: 'block',
      }}
      {...props}
    />
  );
};

export { Image };
