import React, { forwardRef } from 'react';
import { Box } from '../box';
import { Text } from '../text';
import { FormLabelProps } from './types';
import { useFormControl } from '../form-control';

export * from './types';

/* eslint react/no-children-prop: 0 */
export const RequiredIndicator = (props: any) => (
  <Box as="span" ml={1} color="red" aria-hidden="true" children="*" {...props} />
);

/**
 * FormLabel is used for form inputs and controls.
 * It reads from the `FormControl` context to handle it's styles for
 * the various form states.
 */
export const FormLabel = forwardRef<any, FormLabelProps>(({ children, ...props }, ref) => {
  const formControl = useFormControl(props);
  return (
    <Text
      ref={ref}
      pb="4px"
      opacity={formControl.isDisabled ? 0.4 : 1}
      textAlign="left"
      verticalAlign="middle"
      display="inline-block"
      as="label"
      textStyle="body.small.medium"
      {...props}
    >
      {children}
      {formControl.isRequired && <RequiredIndicator />}
    </Text>
  );
});

FormLabel.displayName = 'FormLabel';

export default FormLabel;
