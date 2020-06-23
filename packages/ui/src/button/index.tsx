import React, { Ref, forwardRef } from 'react';
import { PseudoBox } from '../pseudo-box';
import { Box } from '../box';
import { useButtonStyle } from './styles';
import { Spinner } from '../spinner';
import { ButtonProps } from './types';
import { useHover } from 'use-events';

export * from './types';

const HoverChange = ({ isHovered, isDisabled }: { isHovered: boolean; isDisabled: boolean }) => (
  <Box
    borderRadius="6px"
    position="absolute"
    width="100%"
    height="100%"
    left={0}
    top={0}
    bg="darken.150"
    opacity={!isDisabled && isHovered ? 1 : 0}
    zIndex={1}
    transition="all 250ms"
  />
);

export const Button = forwardRef<Ref<HTMLDivElement>, ButtonProps>(
  (
    {
      isDisabled,
      isActive,
      children,
      as: Comp,
      mode = 'primary',
      variant = 'solid',
      type,
      size = 'md',
      isLoading,
      loadingText,
      customStyles,
      ...rest
    },
    ref
  ) => {
    const styles = useButtonStyle({
      variant,
      mode,
      size,
      customStyles,
    });

    const [hovered, bind] = useHover();

    return (
      <PseudoBox
        disabled={isDisabled}
        aria-disabled={isDisabled}
        ref={ref}
        type={type}
        borderRadius="6px"
        fontWeight="medium"
        position="relative"
        data-active={isActive ? 'true' : undefined}
        as={Comp || 'button'}
        {...rest}
        {...styles}
        {...bind}
      >
        <Box
          as="span"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          zIndex={5}
        >
          {isLoading && (
            <Spinner
              position={loadingText ? 'relative' : 'absolute'}
              mx={!loadingText ? 'auto' : 'unset'}
              color="currentColor"
              size={size === 'sm' ? 'xs' : 'sm'}
            />
          )}
          {isLoading
            ? <Box ml="tight">{loadingText}</Box> || (
                <Box ml="tight" as="span" opacity={0}>
                  {children}
                </Box>
              )
            : children}
        </Box>
        {mode === 'primary' ? (
          <HoverChange isDisabled={isDisabled || false} isHovered={hovered} />
        ) : null}
      </PseudoBox>
    );
  }
);

Button.displayName = 'Button';
