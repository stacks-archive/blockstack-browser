import { broadcastRawTransaction } from '@stacks/transactions';
import { TransactionPayload, TransactionTypes } from '@stacks/connect';
import {
  generateContractCallTx,
  generateContractDeployTx,
  generateSTXTransferTx,
} from '@common/transactions/transaction-utils';
import { Buffer } from 'buffer';
import { validateTxId } from '@common/validation/validate-tx-id';

interface BroadcastTransactionOptions {
  txRaw: string;
  serialized: Buffer;
  isSponsored: boolean;
  attachment?: string;
  networkUrl: string;
}

export async function handleBroadcastTransaction(options: BroadcastTransactionOptions) {
  const { txRaw, serialized, isSponsored, attachment, networkUrl } = options;
  // if sponsored, return raw tx
  if (isSponsored)
    return {
      txRaw,
    };
  const response = await broadcastRawTransaction(
    serialized,
    `${networkUrl}/v2/transactions`,
    attachment ? Buffer.from(attachment, 'hex') : undefined
  );

  if (typeof response === 'string') {
    const isValidTxId = validateTxId(response);
    if (isValidTxId)
      return {
        txId: response,
        txRaw,
      };
    console.error(`Error broadcasting raw transaction -- ${response}`);
    throw new Error(response);
  } else {
    console.error('Error broadcasting raw transaction');
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
