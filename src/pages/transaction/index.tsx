import React, { useMemo, useCallback, useState } from 'react';
import { Box, Button, Flex, Text } from '@stacks/ui';
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
import { showTxDetails } from '@store/recoil/transaction';
import { useRecoilValue } from 'recoil';
import { TransactionTypes } from '@stacks/connect';
import { getAccountDisplayName } from '@stacks/wallet-sdk';
import { useWallet } from '@common/hooks/use-wallet';
import { TransactionError, TransactionErrorReason } from './transaction-error';
import BigNumber from 'bignumber.js';

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

export const TransactionPage: React.FC = () => {
  useSetupTx();
  const {
    pendingTransaction,
    signedTransaction,
    doSubmitPendingTransaction,
    broadcastError,
  } = useTxState();
  const { currentAccount, currentAccountStxAddress } = useWallet();
  const balances = useFetchBalances();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showDetails = useRecoilValue(showTxDetails);
  const txType = pendingTransaction?.txType;
  const pageTitle = useMemo(() => {
    if (txType === TransactionTypes.STXTransfer) {
      return 'Transfer STX';
    } else if (txType === TransactionTypes.ContractDeploy) {
      return 'Deploy contract';
    }
    return 'Sign transaction';
  }, [txType]);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    await doSubmitPendingTransaction();
    setIsSubmitting(false);
  }, [doSubmitPendingTransaction]);

  const error = useMemo<TransactionErrorReason | void>(() => {
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
  }, [balances, currentAccount, pendingTransaction, broadcastError]);

  if (error !== undefined) {
    return <TransactionError reason={error} />;
  }

  if (!currentAccount || !pendingTransaction) throw new Error('Invalid code path.');

  const appName = pendingTransaction?.appDetails?.name;

  return (
    <PopupContainer>
      <Box width="100%" mt="loose" data-test="home-page">
        <Flex flexDirection="row" width="100%">
          <Box flexGrow={1}>
            <Text
              fontSize={2}
              fontWeight="600"
              fontFamily="heading"
              color="ink.1000"
              display="block"
            >
              {getAccountDisplayName(currentAccount)}
            </Text>
          </Box>
          <Box>
            {balances.value ? (
              <Text textStyle="body.small" color="ink.600" fontSize={1}>
                {stacksValue({ value: balances.value.stx.balance, withTicker: true })}
              </Text>
            ) : (
              <LoadingRectangle height="16px" width="50px" />
            )}
          </Box>
        </Flex>
        <Text textStyle="body.small" color="ink.600" fontSize={1}>
          {currentAccountStxAddress}
        </Text>
      </Box>
      <Box mt="base">
        <Text
          display="block"
          fontFamily="heading"
          textStyle="display.large"
          fontSize={5}
          color="ink.1000"
        >
          {pageTitle}
        </Text>
        <Text textStyle="caption" color="ink.600">
          {appName ? `with ${appName}` : ''}
        </Text>
      </Box>
      <PostConditions />
      {showDetails && (
        <>
          <ContractCallDetails />
          <StxTransferDetails />
          <ContractDeployDetails />
        </>
      )}
      <Box flexGrow={1} />
      <Box width="100%" mt="extra-loose">
        <Flex>
          <Box flexGrow={1}>
            <Text textStyle="caption" color="ink.600">
              Fees
            </Text>
          </Box>
          <Box>
            <Text textStyle="caption" color="ink.600">
              {signedTransaction.state === 'loading' && !signedTransaction.value ? (
                <LoadingRectangle width="100px" height="14px" />
              ) : null}
              {signedTransaction.value
                ? stacksValue({
                    value: signedTransaction.value.auth.spendingCondition?.fee?.toNumber() || 0,
                  })
                : null}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Box mt="base">
        <Button
          width="100%"
          onClick={submit}
          isLoading={isSubmitting}
          isDisabled={!signedTransaction.value}
        >
          Confirm
        </Button>
      </Box>
    </PopupContainer>
  );
};
