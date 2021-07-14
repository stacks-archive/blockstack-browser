import { FormikErrors } from 'formik';
import BigNumber from 'bignumber.js';

import { useWallet } from '@common/hooks/use-wallet';
import { useFetchBalances } from '@common/hooks/account/use-account-info';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { microStxToStx, validateAddressChain, validateStacksAddress } from '@common/stacks-utils';
import { FormValues } from '@pages/send-tokens/send-tokens';
import { STX_TRANSFER_TX_SIZE_BYTES } from '@common/constants';

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
}

export const useSendFormValidation = ({ setAssetError }: UseSendFormValidationArgs) => {
  const { currentNetwork, currentAccountStxAddress } = useWallet();
  const balances = useFetchBalances();
  const { selectedAsset } = useSelectedAsset();
  const isStx = selectedAsset?.type === 'stx';
  const selectedAssetHasDecimals =
    isStx ||
    (typeof selectedAsset?.meta?.decimals === 'number' && selectedAsset?.meta.decimals !== 0);

  return async ({ recipient, amount }: { recipient: string; amount: string | number }) => {
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
      if (!selectedAssetHasDecimals && valueHasDecimals)
        errors.amount = SendFormErrorMessages.DoesNotSupportDecimals;

      if (balances) {
        const amountBN = new BigNumber(amount);
        if (selectedAsset.type === 'stx') {
          const curBalance = microStxToStx(balances.stx.balance);
          const lockedBalance = microStxToStx(balances.stx.locked);
          const availableBalance = curBalance
            .minus(lockedBalance)
            .minus(microStxToStx(STX_TRANSFER_TX_SIZE_BYTES));
          if (availableBalance.lt(amountBN)) {
            errors.amount = `${
              SendFormErrorMessages.InsufficientBalance
            } ${availableBalance.toString()} STX`;
          }
        }
        const assetBalance = new BigNumber(selectedAsset.balance);
        const assetAmountToTransfer = new BigNumber(amount);
        if (assetAmountToTransfer.isGreaterThan(assetBalance)) {
          errors.amount = `${SendFormErrorMessages.InsufficientBalance} ${selectedAsset.balance} ${selectedAsset.meta?.symbol}`;
        }
      }
    } else {
      setAssetError(SendFormErrorMessages.MustSelectAsset);
    }
    return errors;
  };
};
