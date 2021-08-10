import React, { memo, Suspense, useCallback, useState } from 'react';
import { Box, Text, Button, Stack } from '@stacks/ui';
import { Formik, useFormikContext } from 'formik';

import { PopupContainer } from '@components/popup/container';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';

import { ScreenPaths } from '@common/types';
import { ErrorLabel } from '@components/error-label';
import { AssetSearch } from '@pages/send-tokens/components/asset-search/asset-search';

import { Header } from '@components/header';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';

import { useSendFormValidation } from '@pages/send-tokens/hooks/use-send-form-validation';
import { AmountField } from '@pages/send-tokens/components/amount-field';
import { RecipientField } from '@pages/send-tokens/components/recipient-field';
import { MemoField } from '@pages/send-tokens/components/memo-field';
import { useTransferableAssets } from '@common/hooks/use-assets';
import { useRefreshAllAccountData } from '@common/hooks/account/use-refresh-all-account-data';
import { ConfirmSendDrawer } from '@pages/transaction-signing/components/confirm-send-drawer';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';

type Amount = number | '';

export interface FormValues {
  amount: Amount;
  recipient: string;
  memo: string;
}

const initialValues: FormValues = {
  amount: '',
  recipient: '',
  memo: '',
};

interface SendFormProps {
  assetError: string | undefined;
  setAssetError: (error: string | undefined) => void;
}

const SendForm = (props: SendFormProps) => {
  const { assetError } = props;

  const doChangeScreen = useDoChangeScreen();
  const { selectedAsset } = useSelectedAsset();
  const refreshAllAccountData = useRefreshAllAccountData();
  const assets = useTransferableAssets();

  const { handleSubmit, values, setValues, errors, setFieldError } = useFormikContext<FormValues>();

  const onSubmit = useCallback(async () => {
    if (values.amount && values.recipient && selectedAsset) {
      handleSubmit();
      await refreshAllAccountData(250);
    }
  }, [refreshAllAccountData, handleSubmit, values, selectedAsset]);

  const onItemSelect = useCallback(() => {
    if (assets.length === 1) return;
    setValues({ ...values, amount: '' });
    setFieldError('amount', undefined);
  }, [assets, setValues, values, setFieldError]);

  const hasValues = values.amount && values.recipient !== '';

  return (
    <PopupContainer
      header={<Header title="Send" onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)} />}
    >
      <Stack spacing="loose" flexDirection="column" flexGrow={1} shouldWrapChildren>
        <AssetSearch onItemClick={onItemSelect} />
        <Suspense fallback={<></>}>
          <AmountField value={values.amount || 0} error={errors.amount} />
        </Suspense>
        <RecipientField error={errors.recipient} value={values.recipient} />
        {selectedAsset?.hasMemo && <MemoField value={values.memo} error={errors.memo} />}
        <Box mt="auto">
          {assetError && (
            <ErrorLabel mb="base">
              <Text textStyle="caption">{assetError}</Text>
            </ErrorLabel>
          )}
          <Button
            type="submit"
            borderRadius="12px"
            width="100%"
            onClick={onSubmit}
            isDisabled={!hasValues}
            data-testid={SendFormSelectors.BtnPreviewSendTx}
          >
            Preview
          </Button>
        </Box>
      </Stack>
    </PopupContainer>
  );
};

export const SendTokensForm: React.FC = memo(() => {
  const [isShowing, setShowing] = useState(false);
  const [assetError, setAssetError] = useState<string | undefined>();
  const { selectedAsset } = useSelectedAsset();
  const onValidate = useSendFormValidation({ setAssetError });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        if (values.amount && values.recipient && values.recipient !== '' && selectedAsset)
          if (!assetError) {
            setShowing(true);
          }
      }}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      validate={onValidate}
    >
      {form => (
        <>
          <React.Suspense fallback={<></>}>
            <ConfirmSendDrawer
              onClose={() => {
                setShowing(false);
                form.setSubmitting(false);
              }}
              {...form.values}
              amount={form.values.amount || 0}
              isShowing={isShowing}
            />
          </React.Suspense>
          <React.Suspense fallback={<></>}>
            <SendForm setAssetError={setAssetError} assetError={assetError} />
          </React.Suspense>
        </>
      )}
    </Formik>
  );
});
