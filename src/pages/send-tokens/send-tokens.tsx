import React, { memo, useCallback, useState } from 'react';
import { Box, Text, Button, Stack } from '@stacks/ui';
import { Formik, FormikProps } from 'formik';
import { PopupContainer } from '@components/popup/container';
import { ConfirmSendDrawer } from '@components/drawer/confirm-send-drawer';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';

import { ScreenPaths } from '@store/common/types';
import { ErrorLabel } from '@components/error-label';
import { AssetSearch } from '@components/asset-search/asset-search';

import { Header } from '@components/header';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';

import { useSendFormValidation } from '@common/hooks/use-send-form-validation';
import { AmountField } from '@components/send/amount-field';
import { RecipientField } from '@components/send/recipient-field';
import { MemoField } from '@components/send/memo-field';
import { useRefreshAccountData } from '@common/hooks/account/use-refresh-account-data';

type Amount = number | '';

export interface FormValues {
  amount: Amount;
  recipient: string;
  memo: string;
}

const Form = ({
  handleSubmit,
  handleChange,
  values,
  assetError,
  setFieldValue,
  setErrors,
  setValues,
  errors,
}: {
  assetError: string | undefined;
  setAssetError: (error: string | undefined) => void;
} & FormikProps<FormValues>) => {
  const doChangeScreen = useDoChangeScreen();
  const { selectedAsset } = useSelectedAsset();
  const refreshAccountData = useRefreshAccountData();

  const onChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      setErrors({});
      handleChange(e);
    },
    [setErrors, handleChange]
  );

  const onSubmit = useCallback(async () => {
    if (values.amount && values.recipient && selectedAsset) {
      await refreshAccountData();
      handleSubmit();
    }
  }, [refreshAccountData, handleSubmit, values, selectedAsset]);

  const onItemClick = useCallback(() => {
    setValues({ ...values, amount: '' });
  }, [setValues, values]);

  const hasValues = values.amount && values.recipient !== '';

  return (
    <>
      <PopupContainer
        header={<Header title="Send" onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)} />}
      >
        <Stack spacing="loose" flexDirection="column" flexGrow={1}>
          <AssetSearch onItemClick={onItemClick} />
          <AmountField
            setFieldValue={setFieldValue}
            value={values.amount || 0}
            onChange={onChange}
            error={errors.amount}
          />
          <RecipientField error={errors.recipient} value={values.recipient} onChange={onChange} />
          {selectedAsset?.hasMemo && (
            <MemoField value={values.memo} error={errors.memo} onChange={onChange} />
          )}
          <Box mt="auto">
            {assetError && (
              <ErrorLabel mb="base">
                <Text textStyle="caption">{assetError}</Text>
              </ErrorLabel>
            )}
            <Button borderRadius="12px" width="100%" onClick={onSubmit} isDisabled={!hasValues}>
              Preview
            </Button>
          </Box>
        </Stack>
      </PopupContainer>
    </>
  );
};

export const PopupSend: React.FC = memo(() => {
  const [isShowing, setShowing] = useState(false);
  const [assetError, setAssetError] = useState<string | undefined>();
  const { selectedAsset } = useSelectedAsset();

  const initialValues: FormValues = {
    amount: '',
    recipient: '',
    memo: '',
  };

  const onValidate = useSendFormValidation({
    setAssetError,
  });

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
          <React.Suspense fallback={<></>}>
            <Form setAssetError={setAssetError} assetError={assetError} {...props} />
          </React.Suspense>
        </>
      )}
    </Formik>
  );
});
