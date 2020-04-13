import * as React from 'react';
import { Box, BoxProps } from '../box';

interface SVGProps {
  viewBox?: string;
  fill?: string;
}

type SVG = SVGProps & BoxProps;

export const Svg = ({
  width = 24,
  height = 24,
  viewBox = '0 0 24 24',
  fill = 'none',
  ...rest
}: SVG) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return <Box as="svg" width={width} height={height} viewBox={viewBox} fill={fill} {...rest} />;
};
