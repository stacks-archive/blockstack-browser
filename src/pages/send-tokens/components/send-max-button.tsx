import React, { FC, Suspense } from 'react';
import { Box, color, ButtonProps } from '@stacks/ui';
import { useCurrentFee } from '@common/hooks/use-current-fee';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';

const SendMaxButton: FC<ButtonProps> = props => (
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
    _hover={{ color: color('text-title') }}
    {...props}
  >
    Max
  </Box>
);

interface SendMaxProps extends ButtonProps {
  onSetMax(fee: number): void;
}
function SendMax({ onSetMax, ...props }: SendMaxProps) {
  const fee = useCurrentFee();
  return (
    <SendMaxButton
      onClick={() => onSetMax(fee)}
      data-testid={SendFormSelectors.BtnSendMaxBalance}
      {...props}
    />
  );
}

interface SendMaxWithSuspense extends SendMaxProps {
  showButton: boolean;
}
export function SendMaxWithSuspense({ showButton, onSetMax, ...props }: SendMaxWithSuspense) {
  return (
    <Suspense fallback={<SendMaxButton />}>
      {showButton ? <SendMax onSetMax={fee => onSetMax(fee)} {...props} /> : null}
    </Suspense>
  );
}
