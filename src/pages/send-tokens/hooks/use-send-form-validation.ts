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
    if (!validateAddressChain(recipient, currentNetwork)) {
      errors.recipient = 'The address is for the incorrect Stacks network';
    } else if (!validateStacksAddress(recipient)) {
      errors.recipient = 'The address you provided is not valid';
    } else if (recipient === currentAccountStxAddress) {
      errors.recipient = 'Cannot send to yourself';
    }
    if (amount === '') {
      errors.amount = 'You must specify an amount';
    } else if (amount <= 0) {
      errors.amount = 'Must be more than zero';
    }
    if (selectedAsset) {
      const valueHasDecimals = typeof amount === 'string' && amount.includes('.');
      if (!selectedAssetHasDecimals && valueHasDecimals)
        errors.amount = 'This token does not support decimal places.';

      if (balances) {
        const amountBN = new BigNumber(amount);
        if (selectedAsset.type === 'stx') {
          const curBalance = microStxToStx(balances.stx.balance);
          const lockedBalance = microStxToStx(balances.stx.locked);
          const availableBalance = curBalance
            .minus(lockedBalance)
            .minus(microStxToStx(STX_TRANSFER_TX_SIZE_BYTES));
          if (availableBalance.lt(amountBN)) {
            errors.amount = `Insufficient balance. Your available balance is ${availableBalance.toString()} STX`;
          }
        }
        const assetBalance = new BigNumber(selectedAsset.balance);
        const assetAmountToTransfer = new BigNumber(amount);
        if (assetAmountToTransfer.isGreaterThan(assetBalance)) {
          errors.amount = 'Cannot transfer more than balance';
        }
      }
    } else {
      setAssetError('You must select a valid token to transfer');
    }
    return errors;
  };
};
