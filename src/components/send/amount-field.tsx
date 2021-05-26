import { Box, color, Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import React, { memo } from 'react';
import { useAssets } from '@common/hooks/use-assets';
import { useFetchBalances } from '@common/hooks/account/use-account-info';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { ErrorLabel } from '@components/error-label';
import { useSendAmountFieldActions } from '@common/hooks/use-send-form';
import { FormikProps } from 'formik';
import { FormValues } from '@pages/popup/send';

interface AmountFieldProps extends Pick<FormikProps<FormValues>, 'setFieldValue'> {
  value: number;
  error?: string;
  onChange?: any;
}

// TODO: this should use a new "Field" component (with inline label like in figma)
export const AmountField = memo(
  ({ onChange, value, error, setFieldValue, ...rest }: AmountFieldProps & StackProps) => {
    const assets = useAssets();
    const balances = useFetchBalances();
    const { selectedAsset, placeholder } = useSelectedAsset();
    const { handleOnKeyDown, handleSetSendMax } = useSendAmountFieldActions({
      setFieldValue,
    });

    return (
      <Stack {...rest}>
        <InputGroup flexDirection="column">
          <Text
            as="label"
            display="block"
            mb="tight"
            fontSize={1}
            fontWeight="500"
            htmlFor="amount"
          >
            Amount
          </Text>
          <Box position="relative">
            <Input
              display="block"
              type="text"
              inputMode="numeric"
              width="100%"
              placeholder={placeholder || 'Select an asset first'}
              min="0"
              autoFocus={assets.value?.length === 1}
              value={value === 0 ? '' : value}
              onKeyDown={handleOnKeyDown}
              onChange={onChange}
              autoComplete="off"
              name="amount"
            />
            {balances.value && selectedAsset ? (
              <Box
                as="button"
                color={color('text-caption')}
                textStyle="caption"
                position="absolute"
                right="base"
                top="11px"
                border="1px solid"
                borderColor={color('border')}
                py="extra-tight"
                px="tight"
                borderRadius="8px"
                onClick={handleSetSendMax}
                _hover={{ color: color('text-title') }}
              >
                Max
              </Box>
            ) : null}
          </Box>
        </InputGroup>
        {error && (
          <ErrorLabel>
            <Text textStyle="caption">{error}</Text>
          </ErrorLabel>
        )}
      </Stack>
    );
  }
);
