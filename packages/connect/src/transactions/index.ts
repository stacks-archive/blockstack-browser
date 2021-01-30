import { UserSession, AppConfig } from '@stacks/auth';
import { SECP256K1Client, TokenSigner } from 'jsontokens';
import {
  ContractCallOptions,
  ContractCallPayload,
  ContractDeployOptions,
  ContractDeployPayload,
  TransactionPopup,
  TransactionOptions,
  STXTransferOptions,
  STXTransferPayload,
  TransactionPayload,
  TransactionTypes,
} from '../types/transactions';
import {
  serializeCV,
  ChainID,
  deserializeTransaction,
  BufferReader,
  serializePostCondition,
  PostCondition,
} from '@stacks/transactions';
import { getStacksProvider } from '../utils';
import { StacksTestnet } from '@stacks/network';

const getUserSession = (_userSession?: UserSession) => {
  let userSession = _userSession;

  if (!userSession) {
    const appConfig = new AppConfig(['store_write'], document.location.href);
    userSession = new UserSession({ appConfig });
  }
  return userSession;
};

const getKeys = (_userSession?: UserSession) => {
  const userSession = getUserSession(_userSession);
  const privateKey = userSession.loadUserData().appPrivateKey;
  const publicKey = SECP256K1Client.derivePublicKey(privateKey);

  return { privateKey, publicKey };
};

function getStxAddress(options: TransactionOptions) {
  const { stxAddress, userSession, network } = options;

  if (stxAddress) return stxAddress;
  if (!userSession || !network) return undefined;
  const stxAddresses = userSession?.loadUserData().profile?.stxAddress;
  const chainIdToKey = {
    [ChainID.Mainnet]: 'mainnet',
    [ChainID.Testnet]: 'testnet',
  };
  const address: string | undefined = stxAddresses?.[chainIdToKey[network.chainId]];
  return address;
}

function getDefaults(options: TransactionOptions) {
  const network = options.network || new StacksTestnet();
  const userSession = getUserSession(options.userSession);
  const defaults: TransactionOptions = {
    ...options,
    network,
    userSession,
  };
  return {
    stxAddress: getStxAddress(defaults),
    ...defaults,
  };
}

const signPayload = async (payload: TransactionPayload, privateKey: string) => {
  let { postConditions } = payload;
  if (postConditions && typeof postConditions[0] !== 'string') {
    postConditions = (postConditions as PostCondition[]).map(pc =>
      serializePostCondition(pc).toString('hex')
    );
  }
  const tokenSigner = new TokenSigner('ES256k', privateKey);
  return tokenSigner.signAsync({
    ...payload,
    postConditions,
  } as any);
};

const openTransactionPopup = ({ token, options }: TransactionPopup) => {
  const provider = getStacksProvider();
  if (!provider) {
    throw new Error('Stacks Wallet not installed.');
  }
  void provider.transactionRequest(token).then(data => {
    const finishedCallback = options.finished || options.onFinish;
    const { txRaw } = data;
    const txBuffer = Buffer.from(txRaw.replace(/^0x/, ''), 'hex');
    const stacksTransaction = deserializeTransaction(new BufferReader(txBuffer));
    finishedCallback?.({
      ...data,
      stacksTransaction,
    });
  });

  if (true) return;
};

export const makeContractCallToken = async (options: ContractCallOptions) => {
  const { functionArgs, appDetails, userSession, ..._options } = options;
  const { privateKey, publicKey } = getKeys(userSession);

  const args: string[] = functionArgs.map(arg => {
    if (typeof arg === 'string') {
      return arg;
    }
    return serializeCV(arg).toString('hex');
  });

  const payload: ContractCallPayload = {
    ..._options,
    functionArgs: args,
    txType: TransactionTypes.ContractCall,
    publicKey,
  };

  if (appDetails) {
    payload.appDetails = appDetails;
  }

  return signPayload(payload, privateKey);
};

export const makeContractDeployToken = async (options: ContractDeployOptions) => {
  const { appDetails, userSession, ..._options } = options;
  const { privateKey, publicKey } = getKeys(userSession);

  const payload: ContractDeployPayload = {
    ..._options,
    publicKey,
    txType: TransactionTypes.ContractDeploy,
  };

  if (appDetails) {
    payload.appDetails = appDetails;
  }

  return signPayload(payload, privateKey);
};

export const makeSTXTransferToken = async (options: STXTransferOptions) => {
  const { amount, appDetails, userSession, ..._options } = options;
  const { privateKey, publicKey } = getKeys(userSession);

  const payload: STXTransferPayload = {
    ..._options,
    amount: amount.toString(10),
    publicKey,
    txType: TransactionTypes.STXTransfer,
  };

  if (appDetails) {
    payload.appDetails = appDetails;
  }

  return signPayload(payload, privateKey);
};

async function generateTokenAndOpenPopup<T extends TransactionOptions>(
  options: T,
  makeTokenFn: (options: T) => Promise<string>
) {
  const token = await makeTokenFn({
    ...getDefaults(options),
    ...options,
  });
  return openTransactionPopup({ token, options });
}

export const openContractCall = async (options: ContractCallOptions) =>
  generateTokenAndOpenPopup(options, makeContractCallToken);

export const openContractDeploy = async (options: ContractDeployOptions) =>
  generateTokenAndOpenPopup(options, makeContractDeployToken);

export const openSTXTransfer = async (options: STXTransferOptions) =>
  generateTokenAndOpenPopup(options, makeSTXTransferToken);
