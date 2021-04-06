import React, { useEffect, useRef, useState } from 'react';
import { Box, InputGroup, Input, Text, Button, usePrevious, Stack } from '@stacks/ui';
import { Formik, FormikErrors, FormikProps } from 'formik';
import { PopupContainer } from '@components/popup/container';
import { ConfirmSendDrawer } from '@components/drawer/confirm-send-drawer';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { ScreenPaths } from '@store/onboarding/types';
import { Link } from '@components/link';
import BigNumber from 'bignumber.js';
import { microStxToStx, validateAddressChain, validateStacksAddress } from '@common/stacks-utils';
import { ErrorLabel } from '@components/error-label';
import { AssetSearch } from '@components/asset-search/asset-search';
import { useFetchBalances } from '@common/hooks/use-account-info';
import { RPCClient } from '@stacks/rpc-client';
import { useWallet } from '@common/hooks/use-wallet';
import { getAssetStringParts } from '@stacks/ui-utils';
import { useRecoilValue } from 'recoil';
import { selectedAssetStore } from '@store/recoil/asset-search';
import { useAssets } from '@common/hooks/use-assets';
import { getTicker } from '@common/utils';

type Amount = number | '';

interface FormValues {
  amount: Amount;
  recipient: string;
}

const useValidateForm = ({ setAssetError }: { setAssetError: (error: string) => void }) => {
  const { currentNetwork, currentAccountStxAddress } = useWallet();
  const balances = useFetchBalances();
  const selectedAsset = useRecoilValue(selectedAssetStore);

  return async ({ recipient, amount }: { recipient: string; amount: string | number }) => {
    const errors: FormikErrors<FormValues> = {};
    if (!validateAddressChain(recipient, currentNetwork)) {
      errors.recipient = 'The address is for the incorrect Stacks network';
    }
    if (!validateStacksAddress(recipient)) {
      errors.recipient = 'The address you provided is not valid.';
    }
    if (recipient === currentAccountStxAddress) {
      errors.recipient = 'Cannot send to yourself.';
    }
    if (amount === '') {
      errors.amount = 'You must specify an amount.';
    }
    if (amount <= 0) {
      errors.amount = 'Must be more than zero.';
    }
    if (selectedAsset) {
      if (balances.value) {
        const amountBN = new BigNumber(amount);
        if (selectedAsset.type === 'stx') {
          const curBalance = microStxToStx(balances.value.stx.balance);
          if (curBalance.lt(amountBN)) {
            errors.amount = `You don't have enough tokens. Your balance is ${curBalance.toString()}`;
          }
        }
      }
      if (selectedAsset.type === 'ft') {
        const { address, contractName } = getAssetStringParts(selectedAsset.contractAddress);
        if (amount.toString().includes('.')) {
          errors.amount = 'When sending a fungible token, amount must be an integer.';
        }
        try {
          const rpcClient = new RPCClient(currentNetwork.url);
          const contractInterface = await rpcClient.fetchContractInterface({
            contractAddress: address,
            contractName,
          });
          const transferFunction = contractInterface.functions.find(func => {
            const correctName = func.name === 'transfer';
            const [recipientArg, amountArg] = func.args;
            const correctRecipient =
              recipientArg?.name === 'recipient' && recipientArg?.type === 'principal';
            const correctAmount = amountArg?.name === 'amount' && amountArg?.type === 'uint128';
            return correctName && correctRecipient && correctAmount && func.args.length === 2;
          });
          if (!transferFunction) {
            setAssetError('The contract you specified does not have a `transfer` function.');
          }
        } catch (error) {
          console.error(error);
          setAssetError('Unable to fetch contract details.');
        }
      }
    } else {
      setAssetError('You must select a valid token to transfer.');
    }
    return errors;
  };
};

function useSendForm({
  setFieldValue,
  assetError,
  setAssetError,
  ref,
  isSubmitting,
  setSubmitting,
}: Pick<FormikProps<FormValues>, 'isSubmitting' | 'setSubmitting' | 'setFieldValue'> & {
  ref: any;
  setAssetError: (error: string | undefined) => void;
  assetError?: string;
}) {
  const balances = useFetchBalances();
  const selectedAsset = useRecoilValue(selectedAssetStore);
  const previous = usePrevious(selectedAsset);
  const assets = useAssets();

  useEffect(() => {
    if (assets.length === 1 && ref.current) {
      ref?.current?.focus?.();
    }
  }, [ref, assets.length]);

  useEffect(() => {
    if (assetError && previous !== selectedAsset) {
      setAssetError(undefined);
      if (isSubmitting) {
        setSubmitting(false);
      }
    }
  }, [setAssetError, assetError, isSubmitting, setSubmitting, previous, selectedAsset]);

  const isStx = selectedAsset?.type === 'stx';

  const handleSetSendMax = () => {
    if (!selectedAsset || !balances.value) return;
    if (isStx) {
      const stx = microStxToStx(balances.value.stx.balance);
      setFieldValue('amount', stx.toNumber());
    } else {
      const token = Object.keys(balances.value.fungible_tokens).find(contract => {
        return contract.startsWith(selectedAsset.contractAddress);
      });
      if (token) {
        setFieldValue('amount', balances.value.fungible_tokens[token].balance);
      }
    }
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (key.length > 1) {
      return;
    }
    const value = event.currentTarget.value;
    // no leading zeros
    if (key === '0' && value.length === 0) return event.preventDefault();
    // only allow decimal if STX
    if (key === '.') {
      if (selectedAsset?.type !== 'stx') return event.preventDefault();
      const hasPeriod = value.includes('.');
      if (hasPeriod && key === '.') {
        return event.preventDefault();
      }
    }
    if (!/^[0-9]|\.+$/.test(key)) {
      return event.preventDefault();
    }
  };

  return {
    handleSetSendMax,
    handleOnKeyDown,
  };
}

const Form = ({
  handleSubmit,
  handleChange,
  errors,
  values,
  assetError,
  isValidating,
  isSubmitting,
  setFieldValue,
  setAssetError,
  setSubmitting,
}: {
  assetError: string | undefined;
  setAssetError: (error: string | undefined) => void;
} & FormikProps<FormValues>) => {
  const ref = useRef();

  const assets = useAssets();
  const balances = useFetchBalances();
  const selectedAsset = useRecoilValue(selectedAssetStore);

  const isStx = selectedAsset?.type === 'stx';
  const placeholder = !selectedAsset
    ? 'Select an asset'
    : isStx
    ? '0.000000 STX'
    : `0 ${getTicker(selectedAsset.name)}`;

  const doChangeScreen = useDoChangeScreen();

  const { handleOnKeyDown, handleSetSendMax } = useSendForm({
    ref,
    setFieldValue,
    setAssetError,
    assetError,
    isSubmitting,
    setSubmitting,
  });
  return (
    <>
      <PopupContainer title="Send" onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)}>
        <Stack
          spacing="loose"
          as="form"
          flexDirection="column"
          flexGrow={1}
          onSubmit={handleSubmit}
        >
          <AssetSearch />
          <Box width="100%">
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
                  placeholder={placeholder}
                  min="0"
                  autoFocus={assets.length === 1}
                  ref={ref as any}
                  value={values.amount}
                  onKeyDown={handleOnKeyDown}
                  onChange={handleChange}
                  autoComplete="off"
                  name="amount"
                />
                {balances.value && selectedAsset ? (
                  <Link
                    color="blue"
                    textStyle="caption"
                    position="absolute"
                    right="base"
                    top="16px"
                    onClick={handleSetSendMax}
                  >
                    Send max
                  </Link>
                ) : null}
              </Box>
            </InputGroup>

            {errors.amount && (
              <ErrorLabel>
                <Text textStyle="caption">{errors.amount}</Text>
              </ErrorLabel>
            )}
          </Box>
          <Box width="100%">
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
                value={values.recipient}
                onChange={handleChange}
                placeholder="Enter an address"
                autoComplete="off"
              />
            </InputGroup>
            {errors.recipient ? (
              <ErrorLabel>
                <Text textStyle="caption">{errors.recipient}</Text>
              </ErrorLabel>
            ) : null}
          </Box>
          <Box mt="auto">
            {assetError ? (
              <ErrorLabel mb="base">
                <Text textStyle="caption">{assetError}</Text>
              </ErrorLabel>
            ) : null}
            <Button
              width="100%"
              onClick={handleSubmit}
              isLoading={!assetError && (isValidating || isSubmitting)}
              isDisabled={!!(assetError || isValidating || isSubmitting)}
            >
              Preview
            </Button>
          </Box>
        </Stack>
      </PopupContainer>
    </>
  );
};

export const PopupSend: React.FC = () => {
  const [isShowing, setShowing] = useState(false);
  const [assetError, setAssetError] = useState<string | undefined>();
  const assets = useAssets();

  const initialValues: FormValues = {
    amount: '',
    recipient: '',
  };

  const onValidate = useValidateForm({
    setAssetError,
  });

  return assets.length ? (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {
        if (!assetError) {
          setShowing(true);
        } else {
        }
      }}
      validateOnChange={false}
      validate={onValidate}
    >
      {props => (
        <>
          <React.Suspense fallback={<></>}>
            <ConfirmSendDrawer
              onClose={() => {
                setShowing(false);
                props.setSubmitting(false);
              }}
              {...props.values}
              amount={props.values.amount || 0}
              isShowing={isShowing}
            />
          </React.Suspense>
          <Form setAssetError={setAssetError} assetError={assetError} {...props} />
        </>
      )}
    </Formik>
  ) : null;
};
