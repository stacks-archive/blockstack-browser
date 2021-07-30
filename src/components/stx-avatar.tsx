import React from 'react';
import { StxIcon } from '@components/icons/stx-icon';
import { MicroblockIcon } from '@components/icons/microblock';
import { BoxProps, Circle, color, DynamicColorCircle } from '@stacks/ui';
import { TypeIconWrapper } from '@components/tx-icon';

const microIcon = () => (
  <MicroblockIcon
    size="13px"
    fill={color('bg')}
    borderColor={color('invert')}
    bg={color('invert')}
  />
);

const iconItem = (isUnanchored = false) =>
  isUnanchored ? <TypeIconWrapper icon={microIcon} bg="invert" /> : null;

export const StxAvatar: React.FC<StxAvatarProps> = props => {
  return (
    <Circle position="relative" size="36px" bg={color('accent')} color={color('bg')} {...props}>
      <StxIcon/>
      {iconItem(props.isUnanchored)}
    </Circle>
  );
};

interface AssetProps extends BoxProps {
  gradientString: string;
  useStx: boolean;
  isUnanchored?: boolean;
}

interface StxAvatarProps extends BoxProps {
  isUnanchored?: boolean;
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
      {iconItem(props.isUnanchored)}
    </DynamicColorCircle>
  );
};
