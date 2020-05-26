import React, { Children, cloneElement } from 'react';
import { Box } from '../box';
import { Input } from '../input';
import { inputSizes } from '../input/styles';
import { InputLeftElement, InputRightElement } from '../input-element';
import { useTheme } from '../hooks';
import { InputGroupProps } from './types';

const InputGroup = ({ children, size = 'default', ...props }: InputGroupProps) => {
  const { sizes } = useTheme();
  const height = inputSizes[size] && inputSizes[size].height;
  let pl: string | null = null;
  let pr: string | null = null;
  return (
    <Box display="flex" position="relative" {...props}>
      {Children.map(children, child => {
        if (!React.isValidElement(child)) {
          return null;
        }

        if (child.type === InputLeftElement) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          pl = sizes[height];
        }
        if (child.type === InputRightElement) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          pr = sizes[height];
        }
        if (child.type === Input) {
          return cloneElement(child, {
            width: '100%',
            pl: child.props.pl || pl,
            pr: child.props.pr || pr,
          });
        }
        return cloneElement(child, { size });
      })}
    </Box>
  );
};

export { InputGroup };
