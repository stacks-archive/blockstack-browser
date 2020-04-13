import React, { cloneElement, forwardRef } from 'react';
import { css } from '@styled-system/css';
import { Dict, getValidChildren, mapResponsive, __DEV__ } from '../utils';
import { BoxProps, PropsOf, StyledSystemProps } from '../box';
import { FlexProps } from '../flex';
import { Responsive } from '../theme';

import { Box } from '../box';

export type StackDirection = Responsive<'row' | 'column'>;

type StackOptions = Pick<FlexProps, 'align' | 'justify' | 'wrap'> & {
  /**
   * The space between each stack item
   */
  spacing?: StyledSystemProps['margin'];
  /**
   * The direction to stack the items.
   */
  direction?: StackDirection;
  /**
   * If `true`, each stack item will show a divider
   */
  divider?: React.ReactElement;
  /**
   * If `true` the items will be stacked horizontally inline.
   */
  isInline?: boolean;
};

export type StackProps = PropsOf<typeof Box> & StackOptions;

export const StackDivider = (props: BoxProps) => (
  <Box as="hr" border="0" alignSelf="stretch" {...props} />
);

/**
 * Stack
 *
 * Used to stack elements in the horizontal or vertical direction,
 * and apply a space or/and divider between each child.
 *
 * It uses `display: flex` internally and renders a `div`.
 *
 *
 */
export const Stack = forwardRef((props: StackProps, ref: React.Ref<any>) => {
  const {
    direction = 'column',
    justify = 'flex-start',
    align,
    spacing = 'base-tight',
    wrap,
    children,
    divider,
    isInline,
    ...rest
  } = props;

  const selector = '> * + *';

  const localDirection = isInline ? 'row' : direction;

  const styles = {
    flexDirection: mapResponsive(localDirection, value => (value === 'row' ? 'row' : 'column')),
    [selector]: mapResponsive(localDirection, value => ({
      [value === 'column' ? 'marginTop' : 'marginLeft']: spacing,
      [value === 'column' ? 'marginLeft' : 'marginTop']: 0,
    })),
  };

  const validChildren = getValidChildren(children);

  const dividerStyles = mapResponsive(localDirection, value => {
    if (value === 'row') {
      return {
        marginX: spacing,
        marginY: 0,
        borderLeft: '1px solid',
        borderBottom: 0,
        width: 'auto',
      };
    }
    return {
      marginX: 0,
      marginY: spacing,
      borderLeft: 0,
      borderBottom: '1px solid',
      width: '100%',
    };
  });

  const hasDivider = !!divider;

  const clones = validChildren.map((child, index) => {
    if (!hasDivider) return child;

    const isLast = index + 1 === validChildren.length;

    if (!isLast) {
      return (
        <React.Fragment key={index}>
          {child}
          {cloneElement(divider as React.ReactElement<any>, {
            css: css({ '&': dividerStyles }),
          })}
        </React.Fragment>
      );
    }

    return child;
  });

  const getStyle = (theme: Dict) => {
    if (hasDivider) return undefined;
    return css({ [selector]: styles[selector] })(theme);
  };

  return (
    <Box
      ref={ref}
      display="flex"
      alignItems={align}
      justifyContent={justify}
      flexDirection={styles.flexDirection}
      flexWrap={wrap}
      css={getStyle}
      {...rest}
    >
      {clones}
    </Box>
  );
});

if (__DEV__) {
  Stack.displayName = 'Stack';
}
