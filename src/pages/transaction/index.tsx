import React, { useMemo, useCallback, useState } from 'react';
import { Box, Button, color, Flex, Stack, StackProps } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { LoadingRectangle } from '@components/loading-rectangle';
import { useTxState } from '@common/hooks/use-tx-state';
import { useFetchBalances } from '@common/hooks/use-account-info';
import { useSetupTx } from '@common/hooks/use-setup-tx';
import { stacksValue } from '@common/stacks-utils';
import { ContractCallDetails } from '@components/transactions/contract-call-details';
import { StxTransferDetails } from '@components/transactions/stx-transfer-details';
import { ContractDeployDetails } from '@components/transactions/contract-deploy-details';
import { PostConditions } from '@components/transactions/post-conditions/list';
import { showTxDetails } from '@store/transaction';
import { useRecoilValue } from 'recoil';
import { TransactionTypes } from '@stacks/connect';
import { useWallet } from '@common/hooks/use-wallet';
import { TransactionError, TransactionErrorReason } from './transaction-error';
import { AuthType } from '@stacks/transactions';
import BigNumber from 'bignumber.js';
import { Caption, Text, Title } from '@components/typography';
import { useOrigin } from '@common/hooks/use-origin';
import { SpaceBetween } from '@components/space-between';
import { useCurrentNetwork } from '@common/hooks/use-current-network';
import { useDrawers } from '@common/hooks/use-drawers';
import { PopupHeader } from '@components/transactions/popup-header';

export const TxLoading: React.FC = () => {
  return (
    <Flex flexDirection="column" mt="extra-loose">
      <Box width="100%">
        <LoadingRectangle width="60%" height="24px" />
      </Box>
      <Box width="100%" mt="base">
        <LoadingRectangle width="40%" height="16px" />
      </Box>
    </Flex>
  );
};

export const FeeValue = () => {
  const { signedTransaction: tx } = useTxState();
  if (tx.state === 'loading' && !tx.value) return <LoadingRectangle width="100px" height="14px" />;

  if (!tx.value) return null;

  const sponsored = tx.value.auth.authType === AuthType.Sponsored;

  return (
    <>
      {sponsored
        ? '🎉 sponsored'
        : stacksValue({
            value: tx.value.auth.spendingCondition?.fee?.toNumber() || 0,
          })}
    </>
  );
};

function useTransactionError() {
  const { pendingTransaction, broadcastError, isUnauthorizedTransaction } = useTxState();
  const { currentAccount } = useWallet();
  const balances = useFetchBalances();

  return useMemo<TransactionErrorReason | void>(() => {
    if (isUnauthorizedTransaction) return TransactionErrorReason.Unauthorized;

    if (!pendingTransaction || balances.errorMaybe() || !currentAccount) {
      return TransactionErrorReason.Generic;
    }
    if (broadcastError) return TransactionErrorReason.BroadcastError;
    if (balances.value) {
      const stxBalance = new BigNumber(balances.value.stx.balance);
      if (pendingTransaction.txType === TransactionTypes.STXTransfer) {
        const transferAmount = new BigNumber(pendingTransaction.amount);
        if (transferAmount.gte(stxBalance)) {
          return TransactionErrorReason.StxTransferInsufficientFunds;
        }
      }
    }
    return;
  }, [balances, currentAccount, pendingTransaction, broadcastError, isUnauthorizedTransaction]);
}

function useTransactionPageTitle() {
  const { pendingTransaction } = useTxState();
  const txType = pendingTransaction?.txType;
  return useMemo(() => {
    if (!pendingTransaction) return;
    if (txType === TransactionTypes.STXTransfer) return 'Confirm transfer';
    if (txType === TransactionTypes.ContractDeploy) return 'Deploy contract';
    if (txType === TransactionTypes.ContractCall && 'functionName' in pendingTransaction)
      return pendingTransaction.functionName || 'Sign transaction';
    return 'Sign transaction';
  }, [pendingTransaction, txType]);
}

export const TransactionPage: React.FC = () => {
  const isSetup = useSetupTx();

  const { pendingTransaction } = useTxState();
  const { currentAccount } = useWallet();
  const origin = useOrigin();
  const pageTitle = useTransactionPageTitle();
  const error = useTransactionError();
  const showDetails = useRecoilValue(showTxDetails);
  const appName = pendingTransaction?.appDetails?.name;

  if (!isSetup) {
    // loading state
    return <></>;
  }
  if (error !== undefined) {
    return <TransactionError reason={error} />;
  }
  if (!currentAccount || !pendingTransaction) throw new Error('Invalid code path.');

  return (
    <PopupContainer header={<PopupHeader />}>
      <Stack pt="extra-loose" spacing="base">
        <Title fontWeight="bold" as="h1">
          {pageTitle}
        </Title>
        {appName ? (
          <Caption>
            Requested by {appName} {origin ? `(${origin?.split('//')[1]})` : null}
          </Caption>
        ) : null}
      </Stack>

      <PostConditions />
      {showDetails && (
        <>
          <ContractCallDetails />
          <StxTransferDetails />
          <ContractDeployDetails />
        </>
      )}
      <ActionBar />
    </PopupContainer>
  );
};

function ActionBar(props: StackProps) {
  const { signedTransaction, doSubmitPendingTransaction } = useTxState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    await doSubmitPendingTransaction();
    setIsSubmitting(false);
  }, [setIsSubmitting, doSubmitPendingTransaction]);
  const { isTestnet } = useCurrentNetwork();
  const { setShowNetworks } = useDrawers();
  return (
    <Stack mt="auto" pt="loose" spacing="loose" bg={color('bg')} {...props}>
      <Stack spacing="base-loose">
        <SpaceBetween>
          <Caption>Fees</Caption>
          <Caption>
            <FeeValue />
          </Caption>
        </SpaceBetween>
        <SpaceBetween>
          <Caption>Network</Caption>
          <Stack
            alignItems="center"
            isInline
            spacing="4px"
            color={isTestnet ? color('feedback-alert') : color('text-caption')}
            onClick={() => setShowNetworks(true)}
            _hover={{
              cursor: 'pointer',
              opacity: 0.7,
            }}
          >
            {isTestnet && (
              <Text
                transform="translateY(1px)"
                display="block"
                fontSize="0.65rem"
                color="currentColor"
              >
                ○
              </Text>
            )}
            <Caption color="currentColor">{isTestnet ? 'Testnet' : 'Mainnet'}</Caption>
          </Stack>
        </SpaceBetween>
      </Stack>
      <Button
        borderRadius="12px"
        py="base"
        width="100%"
        onClick={handleSubmit}
        isLoading={isSubmitting}
        isDisabled={!signedTransaction.value}
      >
        Confirm
      </Button>
    </Stack>
  );
}
