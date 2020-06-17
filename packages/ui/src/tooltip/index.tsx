import * as React from 'react';
import { Box, PropsOf } from '../box';
import { useTooltip, UseTooltipProps } from './hooks';
import { Portal } from '../portal';
import { isString, omit, pick } from '../utils';
import { VisuallyHidden } from '../visually-hidden';

export type TooltipProps = PropsOf<typeof Box> &
  UseTooltipProps & {
    /**
     * The react component to use as the
     * trigger for the tooltip
     */
    children?: React.ReactNode;
    /**
     * The label of the tooltip
     */
    label?: string;
    /**
     * The accessible, human friendly label to use for
     * screen readers.
     *
     * If passed, tooltip will show the content `label`
     * but expose only `aria-label` to assistive technologies
     */
    'aria-label'?: string;
    /**
     * If `true`, the tooltip will wrap it's children
     * in a `<span/>` with `tabIndex=0`
     */
    shouldWrapChildren?: boolean;
    /**
     * If `true`, the tooltip will show an arrow tip
     */
    hasArrow?: boolean;
  };

export function Tooltip(props: TooltipProps) {
  const { children, label, shouldWrapChildren, 'aria-label': ariaLabel, hasArrow, ...rest } = props;

  if (!label || label === '') {
    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(child, { ...child.props, ...rest });
  }

  const { isOpen, getTriggerProps, getTooltipProps, getArrowProps } = useTooltip(props);

  let trigger: React.ReactElement;

  if (isString(children) || shouldWrapChildren) {
    trigger = (
      <Box as="span" tabIndex={0} {...getTriggerProps()}>
        {children}
      </Box>
    );
  } else {
    // ensure tooltip has only one child node
    const child = React.Children.only(children) as React.ReactElement;
    trigger = React.cloneElement(child, getTriggerProps(child.props));
  }

  const hasAriaLabel = Boolean(ariaLabel);

  const baseTooltipProps = getTooltipProps(rest);

  const { style, ...tooltipProps } = hasAriaLabel
    ? omit(baseTooltipProps, ['role', 'id'])
    : baseTooltipProps;

  const hiddenProps = pick(baseTooltipProps, ['role', 'id']);

  return (
    <React.Fragment>
      {trigger}
      {isOpen && (
        <Portal>
          <Box
            paddingX="8px"
            paddingY="tight"
            bg="ink"
            color="white"
            borderRadius="6px"
            textStyle="caption.medium"
            maxWidth="320px"
            {...tooltipProps}
            style={{
              ...style,
              useSelect: 'none',
            }}
          >
            {label}
            {hasAriaLabel && <VisuallyHidden {...hiddenProps}>{ariaLabel}</VisuallyHidden>}
            {hasArrow && <Box data-arrow="" bg="inherit" {...getArrowProps()} />}
          </Box>
        </Portal>
      )}
    </React.Fragment>
  );
}
