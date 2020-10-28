import { Store, applyMiddleware } from 'webext-redux';
import { Wallet, Identity } from '@stacks/keychain';
import { middlewareComponents } from './';

export function deserializer(payload: any) {
  if (payload[0]?.key === 'wallet') {
    const wallet = payload[0].value.currentWallet;
    const newPayload = {
      ...payload[0],
      value: {
        ...payload[0].value,
        currentWallet: wallet ? new Wallet(wallet) : wallet,
      },
    };
    return [newPayload];
  }
  return payload;
}

export function walletDeserializer(key: string, value: any) {
  if (key === 'currentWallet') {
    return new Wallet(value);
  }
  if (key === 'identities') {
    return value.map((identity: any) => {
      return new Identity(identity);
    });
  }
  return value;
}

export const getStore = () => {
  const store = new Store({
    portName: 'ExPort',
    deserializer: (payload: any) => JSON.parse(payload, walletDeserializer),
    serializer: (payload: any) => JSON.stringify(payload),
  });
  applyMiddleware(store, ...middlewareComponents);
  return store;
};

export default getStore;
