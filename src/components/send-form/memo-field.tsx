import { Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import { ErrorLabel } from '@components/error-label';
import React, { memo } from 'react';

interface FieldProps extends StackProps {
  value: string;
  onChange?: any;
  error?: string;
}
// TODO: this should use a new "Field" component (with inline label like in figma)
export const MemoField = memo(({ value, onChange, error, ...props }: FieldProps) => {
  return (
    <Stack width="100%" {...props}>
      <InputGroup flexDirection="column">
        <Text as="label" display="block" mb="tight" fontSize={1} fontWeight="500" htmlFor="memo">
          Memo
        </Text>
        <Input
          display="block"
          type="string"
          width="100%"
          name="memo"
          value={value}
          onChange={onChange}
          placeholder="Enter an message (optional)"
          autoComplete="off"
        />
      </InputGroup>
      {error && (
        <ErrorLabel>
          <Text textStyle="caption">{error}</Text>
        </ErrorLabel>
      )}
    </Stack>
  );
});
