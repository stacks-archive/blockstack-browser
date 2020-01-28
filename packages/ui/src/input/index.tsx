import React from 'react';
import { forwardRef } from 'react';
import { useFormControl } from '../form-control';
import { PseudoBox } from '../pseudo-box';
import { InputProps } from './types';

import useInputStyle from './styles';

export * from './types';

const Input = forwardRef<any, InputProps>((props, ref) => {
  const {
    as,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    isReadOnly,
    // isFullWidth,
    // isDisabled,
    // isInvalid,
    // isRequired,
    ...rest
  } = props;

  const inputStyleProps = useInputStyle(props);
  const formControl = useFormControl(props);

  return (
    <PseudoBox
      ref={ref}
      as={as}
      _readOnly={formControl.isReadOnly}
      aria-readonly={isReadOnly}
      isDisabled={formControl.isDisabled}
      aria-label={ariaLabel}
      aria-invalid={formControl.isInvalid}
      isRequired={formControl.isRequired}
      aria-required={formControl.isRequired}
      aria-disabled={formControl.isDisabled}
      aria-describedby={ariaDescribedby}
      textStyle="body.small"
      {...(inputStyleProps as any)}
      {...rest}
    />
  );
});

Input.defaultProps = {
  as: 'input',
  isFullWidth: true,
  focusBorderColor: 'blue.300',
};

Input.displayName = 'Input';

export { Input };
