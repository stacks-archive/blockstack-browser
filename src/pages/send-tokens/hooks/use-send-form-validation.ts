import { FormikErrors } from 'formik';
import BigNumber from 'bignumber.js';
import { useWallet } from '@common/hooks/use-wallet';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { microStxToStx, validateAddressChain, validateStacksAddress } from '@common/stacks-utils';
import { FormValues } from '@pages/send-tokens/send-tokens';
import { STX_TRANSFER_TX_SIZE_BYTES } from '@common/constants';
import { useCurrentAccountAvailableStxBalance } from '@common/hooks/use-available-stx-balance';
import { countDecimals } from '@common/utils';
import { isTxMemoValid } from '@common/validation/validate-memo';

interface UseSendFormValidationArgs {
  setAssetError: (error: string) => void;
}

export enum SendFormErrorMessages {
  IncorrectAddressMode = 'The address is for the incorrect Stacks network',
  InvalidAddress = 'The address you provided is not valid',
  SameAddress = 'Cannot send to yourself',
  AmountRequired = 'You must specify an amount',
  MustNotBeZero = 'Must be more than zero',
  DoesNotSupportDecimals = 'This token does not support decimal places',
  InsufficientBalance = 'Insufficient balance. Your available balance is:',
  MustSelectAsset = 'You must select a valid token to transfer',
  TooMuchPrecision = '{token} can only have {decimals} decimals',
  MemoExceedsLimit = 'Memo must be less than 34-bytes',
}

function formatPrecisionError(symbol: string, decimals: number) {
  const error = SendFormErrorMessages.TooMuchPrecision;
  return error.replace('{token}', symbol).replace('{decimals}', String(decimals));
}

export const useSendFormValidation = ({ setAssetError }: UseSendFormValidationArgs) => {
  const { currentNetwork, currentAccountStxAddress } = useWallet();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const { selectedAsset, balance } = useSelectedAsset();
  const isSendingStx = selectedAsset?.type === 'stx';
  const selectedAssetHasDecimals =
    isSendingStx ||
    (typeof selectedAsset?.meta?.decimals === 'number' && selectedAsset?.meta.decimals !== 0);

  return async ({
    recipient,
    amount,
    memo,
  }: {
    recipient: string;
    amount: string | number;
    memo: string;
  }) => {
    const errors: FormikErrors<FormValues> = {};
    if (!validateStacksAddress(recipient)) {
      errors.recipient = SendFormErrorMessages.InvalidAddress;
    } else if (!validateAddressChain(recipient, currentNetwork)) {
      errors.recipient = SendFormErrorMessages.IncorrectAddressMode;
    } else if (recipient === currentAccountStxAddress) {
      errors.recipient = SendFormErrorMessages.SameAddress;
    }
    if (amount === '') {
      errors.amount = SendFormErrorMessages.AmountRequired;
    } else if (amount <= 0) {
      errors.amount = SendFormErrorMessages.MustNotBeZero;
    }
    if (selectedAsset) {
      const valueHasDecimals = typeof amount === 'string' && amount.includes('.');
      const parsedAmount = new BigNumber(amount);

      if (!selectedAssetHasDecimals && valueHasDecimals) {
        errors.amount = SendFormErrorMessages.DoesNotSupportDecimals;
      }
      const assetBalance = balance && new BigNumber(balance);
      const assetAmountToTransfer = new BigNumber(amount);

      if (isSendingStx && availableStxBalance) {
        if (countDecimals(parsedAmount) > 6) {
          errors.amount = formatPrecisionError('STX', 6);
        }

        const currentBalance = microStxToStx(availableStxBalance);
        const availableBalance = currentBalance.minus(microStxToStx(STX_TRANSFER_TX_SIZE_BYTES));
        if (availableBalance.lt(assetAmountToTransfer)) {
          errors.amount = `${SendFormErrorMessages.InsufficientBalance} ${
            availableBalance.lt(0) ? '0' : availableBalance.toString()
          } STX`;
        }
      } else {
        if (
          selectedAsset.type === 'ft' &&
          selectedAsset.meta?.decimals &&
          countDecimals(parsedAmount) > selectedAsset.meta.decimals
        ) {
          errors.amount = formatPrecisionError(
            selectedAsset.meta.symbol,
            selectedAsset.meta.decimals
          );
        }
        if (assetBalance && assetBalance.lt(assetAmountToTransfer)) {
          errors.amount = `${SendFormErrorMessages.InsufficientBalance} ${selectedAsset.balance} ${selectedAsset.meta?.symbol}`;
        }
      }
    } else {
      setAssetError(SendFormErrorMessages.MustSelectAsset);
    }
    if (!isTxMemoValid(memo)) {
      errors.memo = SendFormErrorMessages.MemoExceedsLimit;
    }
    return errors;
  };
};
