import React, { useEffect, useRef, useState } from 'react';
import { Box, InputGroup, Input, Text, Button, usePrevious, Stack } from '@stacks/ui';
import { Formik, FormikErrors, FormikProps } from 'formik';
import { PopupContainer } from '@components/popup/container';
import { ConfirmSendDrawer } from '@components/drawer/confirm-send-drawer';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { ScreenPaths } from '@store/types';
import { Link } from '@components/link';
import BigNumber from 'bignumber.js';
import { microStxToStx, validateAddressChain, validateStacksAddress } from '@common/stacks-utils';
import { ErrorLabel } from '@components/error-label';
import { AssetSearch } from '@components/asset-search/asset-search';
import { useFetchBalances } from '@common/hooks/use-account-info';
import { useWallet } from '@common/hooks/use-wallet';
import { useAssets } from '@common/hooks/use-assets';
import { Header } from '@components/header';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { isSip10Transfer } from '@common/token-utils';
import { useRevalidateApi } from '@common/hooks/use-revalidate-api';

type Amount = number | '';

interface FormValues {
  amount: Amount;
  recipient: string;
}

const useValidateForm = ({ setAssetError }: { setAssetError: (error: string) => void }) => {
  const { currentNetwork, currentAccountStxAddress } = useWallet();
  const balances = useFetchBalances();
  const { selectedAsset } = useSelectedAsset();

  return async ({ recipient, amount }: { recipient: string; amount: string | number }) => {
    const errors: FormikErrors<FormValues> = {};
    if (!validateAddressChain(recipient, currentNetwork)) {
      errors.recipient = 'The address is for the incorrect Stacks network';
    } else if (!validateStacksAddress(recipient)) {
      errors.recipient = 'The address you provided is not valid.';
    } else if (recipient === currentAccountStxAddress) {
      errors.recipient = 'Cannot send to yourself.';
    }
    if (amount === '') {
      errors.amount = 'You must specify an amount.';
    } else if (amount <= 0) {
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
        // we do a fetch when getting decimals to determine if the token implements the trait
        // if it is false, we know that it does not conform
        if (selectedAsset.meta?.ftTrait === false) {
          setAssetError('This token does not conform to the fungible token trait (SIP 10)');
        }
        // if it's exactly null, we are not sure
        else if (selectedAsset.meta?.ftTrait === null) {
          const { contractAddress, contractName } = selectedAsset;
          const isSip10 = await isSip10Transfer({
            contractAddress,
            contractName,
            networkUrl: currentNetwork.url,
          });
          if ('error' in isSip10) {
            setAssetError(isSip10.error);
          }
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
  const { selectedAsset, balance } = useSelectedAsset();
  const previous = usePrevious(selectedAsset);
  const assets = useAssets();

  useEffect(() => {
    if (assets.value?.length === 1 && ref.current) {
      ref?.current?.focus?.();
    }
  }, [ref, assets.value?.length]);

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
      setFieldValue('amount', balance);
    }
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const hasDecimals = typeof selectedAsset?.meta?.decimals === 'number';
    const { key } = event;
    const value = event.currentTarget.value;
    // leading zeros
    if (
      selectedAsset?.type !== 'stx' &&
      // if no leading 0 of we don't know the status of decimals
      ((key === '0' && value.length === 0 && !hasDecimals) ||
        // only one leading zero allowed
        (key === '0' && value[0] === '0'))
    )
      return event.preventDefault();
    // decimals check
    if (key === '.') {
      if (!hasDecimals && selectedAsset?.type !== 'stx') return event.preventDefault();
      const hasPeriod = value.includes('.');
      // only one period allowed
      if (hasPeriod && key === '.') {
        return event.preventDefault();
      }
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
  setErrors,
}: {
  assetError: string | undefined;
  setAssetError: (error: string | undefined) => void;
} & FormikProps<FormValues>) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const revalidate = useRevalidateApi();
  const ref = useRef();

  const assets = useAssets();
  const balances = useFetchBalances();
  const { selectedAsset, placeholder } = useSelectedAsset();

  const doChangeScreen = useDoChangeScreen();

  const { handleOnKeyDown, handleSetSendMax } = useSendForm({
    ref,
    setFieldValue,
    setAssetError,
    assetError,
    isSubmitting,
    setSubmitting,
  });

  const onChange = (e: React.ChangeEvent<any>) => {
    setErrors({});
    handleChange(e);
    setHasSubmitted(false);
  };
  return (
    <>
      <PopupContainer
        header={<Header title="Send" onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)} />}
      >
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
                  autoFocus={assets.value?.length === 1}
                  ref={ref as any}
                  value={values.amount}
                  onKeyDown={handleOnKeyDown}
                  onChange={onChange}
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

            {hasSubmitted && errors.amount && (
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
                onChange={onChange}
                placeholder="Enter an address"
                autoComplete="off"
              />
            </InputGroup>
            {hasSubmitted && errors.recipient ? (
              <ErrorLabel>
                <Text textStyle="caption">{errors.recipient}</Text>
              </ErrorLabel>
            ) : null}
          </Box>

          <Box mt="auto">
            {hasSubmitted && assetError ? (
              <ErrorLabel mb="base">
                <Text textStyle="caption">{assetError}</Text>
              </ErrorLabel>
            ) : null}
            <Button
              width="100%"
              onClick={async () => {
                await revalidate(); // we want up to date data
                handleSubmit();
                setHasSubmitted(true);
              }}
              isLoading={!assetError && (isValidating || isSubmitting)}
              isDisabled={
                !!(
                  assetError ||
                  (hasSubmitted && Object.keys(errors).length) ||
                  isValidating ||
                  isSubmitting
                )
              }
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

  return assets?.value?.length ? (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {
        if (!assetError) {
          setShowing(true);
        }
      }}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
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
