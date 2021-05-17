import React from 'react';
import { StxIcon } from '@components/icons/stx-icon';
import { BoxProps, Circle, color, DynamicColorCircle } from '@stacks/ui';

export const StxAvatar: React.FC<BoxProps> = props => {
  return (
    <Circle backgroundColor={color('invert')} {...props}>
      <StxIcon size="12px" />
    </Circle>
  );
};

interface AssetProps extends BoxProps {
  gradientString: string;
  useStx: boolean;
}

export const AssetAvatar: React.FC<AssetProps> = ({
  useStx,
  gradientString,
  children,
  ...props
}) => {
  if (useStx) {
    return <StxAvatar {...props} />;
  }
  return (
    <DynamicColorCircle {...props} string={gradientString}>
      {children}
    </DynamicColorCircle>
  );
};
