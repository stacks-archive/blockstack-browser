import { AuthType, broadcastRawTransaction, StacksTransaction } from '@stacks/transactions';
import { TransactionPayload, TransactionTypes } from '@stacks/connect';
import {
  generateContractCallTx,
  generateContractDeployTx,
  generateSTXTransferTx,
} from '@common/transactions/transaction-utils';
import { TransactionPayloadWithAttachment } from '@store/transactions';

export async function handleBroadcastTransaction(
  signedTransaction: StacksTransaction,
  pendingTransaction: TransactionPayloadWithAttachment,
  networkUrl: string
) {
  const serialized = signedTransaction.serialize();
  const txRaw = `0x${serialized.toString('hex')}`;
  // if sponsored, return raw tx
  if (signedTransaction.auth.authType === AuthType.Sponsored)
    return {
      txRaw,
    };

  const response = await broadcastRawTransaction(
    serialized,
    `${networkUrl}/v2/transactions`,
    pendingTransaction.attachment ? Buffer.from(pendingTransaction.attachment, 'hex') : undefined
  );

  if (typeof response === 'string') {
    return {
      txId: response,
      txRaw,
    };
  } else {
    const error = `${response.error} - ${response.reason}`;
    console.error(error);
    throw new Error(error);
  }
}

function getIsValid(txType: TransactionTypes) {
  return (
    txType === TransactionTypes.STXTransfer ||
    txType === TransactionTypes.ContractCall ||
    txType === TransactionTypes.ContractDeploy
  );
}

interface GenerateSignedTransactionOptions {
  senderKey: string;
  nonce?: number;
  txData: TransactionPayload;
}

export async function generateSignedTransaction({
  txData,
  senderKey,
  nonce,
}: GenerateSignedTransactionOptions) {
  const isValid = getIsValid(txData.txType);

  if (!isValid) throw new Error(`Invalid Transaction Type: ${txData.txType}`);

  switch (txData.txType) {
    case TransactionTypes.ContractCall:
      return generateContractCallTx({ txData, senderKey, nonce });
    case TransactionTypes.ContractDeploy:
      return generateContractDeployTx({ txData, senderKey, nonce });
    case TransactionTypes.STXTransfer:
      return generateSTXTransferTx({ txData, senderKey, nonce });
    default:
      break;
  }
  throw new Error(`Could not sign transaction.`);
}
