import React from 'react';
import { Box } from '@stacks/ui';
import { BoxProps } from '@stacks/ui';

interface GutterProps extends BoxProps {
  multiplier: number;
  base?: number;
}

const Gutter: React.FC<GutterProps> = ({ base = 6, multiplier, ...rest }: GutterProps) => {
  const boxes: React.ReactNode[] = [];
  for (let index = 0; index < multiplier; index++) {
    boxes.push(<Box py={base} key={`gutter-${index}`} {...rest} />);
  }
  return <>{boxes}</>;
};

export default Gutter;
