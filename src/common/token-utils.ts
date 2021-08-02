import { ContractInterface } from '@stacks/rpc-client';
import { abbreviateNumber } from '@common/utils';

function handleErrorMessage(message = 'Error') {
  return {
    error: `This token does not conform to the fungible token trait (SIP 10)${
      message ? `: ${message}` : '.'
    }`,
  };
}

export type SIP010TransferResponse = { okay: true; hasMemo: boolean } | { error: string };

export function isSip10Transfer(contractInterface: ContractInterface): SIP010TransferResponse {
  try {
    let hasCorrectName = false;
    let hasCorrectSender = false;
    let hasCorrectRecipient = false;
    let hasCorrectAmount = false;
    let hasCorrectNumberOfArgs = false;
    let hasMemo = false;
    let has3Args = false;
    let has4Args = false;

    const transferFunction = contractInterface.functions.find(func => {
      const correctName = func.name === 'transfer';
      const [amount, sender, recipient, memo] = func.args;
      const correctAmount = amount?.type === 'uint128';
      const correctSender = sender?.type === 'principal';
      const correctRecipient = recipient?.type === 'principal';
      const correctMemo = (memo?.type as any)?.optional?.buffer?.length === 34; // TODO: cast will be fixed in follow up PR
      if (correctName) hasCorrectName = true;
      if (correctSender) hasCorrectSender = true;
      if (correctRecipient) hasCorrectRecipient = true;
      if (correctAmount) hasCorrectAmount = true;
      if (correctMemo) hasMemo = true;
      if (func.args.length === 3) has3Args = true;
      if (func.args.length === 4) has4Args = true;

      if (has3Args) {
        hasCorrectNumberOfArgs = true;
        return correctName && hasCorrectSender && correctRecipient && correctAmount;
      } else if (has4Args) {
        hasCorrectNumberOfArgs = true;
        return correctName && hasCorrectSender && correctRecipient && correctAmount && correctMemo;
      }
      return false;
    });
    if (!hasCorrectName) {
      return handleErrorMessage('Missing "transfer" function.');
    } else if (!hasCorrectRecipient) {
      return handleErrorMessage('Missing correct recipient argument.');
    } else if (!hasCorrectSender) {
      return handleErrorMessage('Missing correct sender argument.');
    } else if (!hasCorrectAmount) {
      return handleErrorMessage('Missing correct amount argument.');
    } else if (!hasCorrectNumberOfArgs) {
      return handleErrorMessage('Incorrect number of function arguments.');
    } else if (!transferFunction) {
      return handleErrorMessage();
    }
    return { okay: true, hasMemo };
  } catch (error) {
    console.error(error);
    return { error: 'Unable to fetch contract details.' };
  }
}

export function removeCommas(amountWithCommas: string | undefined) {
  if (!amountWithCommas) return;
  return amountWithCommas.replace(/,/g, '');
}

export function getFormattedAmount(amount: string | undefined) {
  const noCommas = removeCommas(amount);
  if (!noCommas) return;
  const number = noCommas?.includes('.') ? parseFloat(noCommas) : parseInt(noCommas);
  return number > 10000
    ? {
        isAbbreviated: true,
        value: abbreviateNumber(number),
      }
    : { value: amount, isAbbreviated: false };
}
