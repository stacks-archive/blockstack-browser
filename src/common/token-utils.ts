import { RPCClient } from '@stacks/rpc-client';

function handleErrorMessage(message = 'Error') {
  return {
    error: `This token does not conform to the fungible token trait (SIP 10)${
      message ? `: ${message}` : '.'
    }`,
  };
}

export async function isSip10Transfer({
  contractAddress,
  contractName,
  networkUrl,
}: {
  contractAddress: string;
  contractName: string;
  networkUrl: string;
}): Promise<{ okay: true } | { error: string }> {
  try {
    const rpcClient = new RPCClient(networkUrl);
    const contractInterface = await rpcClient.fetchContractInterface({
      contractAddress,
      contractName,
    });
    let hasCorrectName = false;
    let hasCorrectSender = false;
    let hasCorrectRecipient = false;
    let hasCorrectAmount = false;
    let hasCorrectNumberOfArgs = false;

    const transferFunction = contractInterface.functions.find(func => {
      const correctName = func.name === 'transfer';
      const [amount, sender, recipient] = func.args;
      const correctAmount = amount?.type === 'uint128';
      const correctSender = sender?.type === 'principal';
      const correctRecipient = recipient?.type === 'principal';
      if (correctName) hasCorrectName = true;
      if (correctSender) hasCorrectSender = true;
      if (correctRecipient) hasCorrectRecipient = true;
      if (correctAmount) hasCorrectAmount = true;
      if (func.args.length === 3) hasCorrectNumberOfArgs = true;
      return correctName && correctRecipient && correctAmount && func.args.length === 3;
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
    return { okay: true };
  } catch (error) {
    return { error: 'Unable to fetch contract details.' };
  }
}
