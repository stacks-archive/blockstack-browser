import React from 'react';

interface ImageProps {
  src?: string;
  alt?: string;
  title?: string;
  loading?: string;
}

const Image: React.FC<ImageProps> = ({ ...props }) => {
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
