import React from 'react';

import { Flex, FlexProps } from '@blockstack/ui';
import { ScreenLoader } from './screen-loader';

interface ScreenBodyProps extends FlexProps {
  noMinHeight?: boolean;
  isLoading?: boolean;
  onSubmit?: () => void;
}

export const Screen: React.FC<ScreenBodyProps> = ({ noMinHeight, isLoading, children, onSubmit, ...rest }) => {
  const fn = onSubmit
    ? (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        onSubmit();
      }
    : undefined;
  return (
    <>
      <ScreenLoader isLoading={isLoading} />
      <Flex
        width="100%"
        flexDirection="column"
        minHeight={noMinHeight ? undefined : ['100vh', 'unset']}
        flex={1}
        style={{ pointerEvents: isLoading ? 'none' : 'unset' }}
        as={onSubmit ? 'form' : 'main'}
        onSubmit={fn}
        {...rest}
      >
        {children}
      </Flex>
    </>
  );
};
