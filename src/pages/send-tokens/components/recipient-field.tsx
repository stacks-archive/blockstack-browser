import { Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import { ErrorLabel } from '@components/error-label';
import React, { memo } from 'react';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import { useFormikContext } from 'formik';

interface RecipientField extends StackProps {
  value: string;
  error?: string;
}
// TODO: this should use a new "Field" component (with inline label like in figma)
export const RecipientField = memo(({ value, error, ...rest }: RecipientField) => {
  const { handleChange } = useFormikContext();
  return (
    <Stack width="100%" {...rest}>
      <InputGroup flexDirection="column">
        <Text
          as="label"
          display="block"
          mb="tight"
          fontSize={1}
          fontWeight="500"
          htmlFor="recipient"
        >
          Recipient
        </Text>
        <Input
          display="block"
          type="string"
          width="100%"
          name="recipient"
          value={value}
          onChange={handleChange}
          placeholder="Enter an address"
          autoComplete="off"
          data-testid={SendFormSelectors.InputRecipientField}
        />
      </InputGroup>
      {error && (
        <ErrorLabel data-testid={SendFormSelectors.InputRecipientFieldErrorLabel}>
          <Text textStyle="caption">{error}</Text>
        </ErrorLabel>
      )}
    </Stack>
  );
});
