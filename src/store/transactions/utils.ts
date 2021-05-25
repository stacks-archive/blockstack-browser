import { decodeToken } from 'jsontokens';
import {
  ContractCallPayload,
  ContractDeployPayload,
  STXTransferPayload,
  TransactionTypes,
} from '@stacks/connect';
import { TransactionPayloadWithAttachment } from '@store/transaction';

export function getPayloadFromToken(requestToken: string) {
  if (!requestToken) return undefined;
  const token = decodeToken(requestToken);
  const payload = token.payload as unknown as TransactionPayloadWithAttachment;

  if (payload.txType === TransactionTypes.ContractCall)
    return payload as ContractCallPayload & {
      attachment?: string;
    };
  if (payload.txType === TransactionTypes.ContractDeploy)
    return payload as ContractDeployPayload & {
      attachment?: string;
    };
  if (payload.txType === TransactionTypes.STXTransfer)
    return payload as STXTransferPayload & {
      attachment?: string;
    };
  return payload;
}
