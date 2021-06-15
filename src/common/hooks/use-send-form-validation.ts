import { useWallet } from '@common/hooks/use-wallet';
import { useFetchBalances } from '@common/hooks/account/use-account-info';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { FormikErrors } from 'formik';
import { microStxToStx, validateAddressChain, validateStacksAddress } from '@common/stacks-utils';
import BigNumber from 'bignumber.js';
import { FormValues } from '@pages/send-tokens/send-tokens';

export const useSendFormValidation = ({
  setAssetError,
}: {
  setAssetError: (error: string) => void;
}) => {
  const { currentNetwork, currentAccountStxAddress } = useWallet();
  const balances = useFetchBalances();
  const { selectedAsset } = useSelectedAsset();

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
      if (balances.value) {
        const amountBN = new BigNumber(amount);
        if (selectedAsset.type === 'stx') {
          const curBalance = microStxToStx(balances.value.stx.balance);
          if (curBalance.lt(amountBN)) {
            errors.amount = `You don't have enough tokens, Your balance is ${curBalance.toString()}`;
          }
        }
      }
    } else {
      setAssetError('You must select a valid token to transfer');
    }
    return errors;
  };
};
