import { atom } from 'jotai';
import { waitForAll } from 'jotai/utils';
import { getPayloadFromToken } from '@store/transactions/utils';
import { walletState } from '@store/wallet';
import { verifyTxRequest } from '@common/transactions/requests';
import { getRequestOrigin, StorageKey } from '@common/storage';
import { atomWithParam } from '@common/atom-with-params';

export const requestTokenState = atomWithParam('transaction?request', null);

export const requestTokenPayloadState = atom(get => {
  const token = get(requestTokenState);
  return token ? getPayloadFromToken(token) : null;
});

export const requestTokenOriginState = atom(get => {
  const token = get(requestTokenState);
  if (!token) return;
  try {
    return getRequestOrigin(StorageKey.transactionRequests, token);
  } catch (e) {
    console.error(e);
    return false;
  }
});

export const transactionRequestValidationState = atom(async get => {
  const { requestToken, wallet, origin } = get(
    waitForAll({
      requestToken: requestTokenState,
      wallet: walletState,
      origin: requestTokenOriginState,
    })
  );
  if (!origin || !wallet || !requestToken) return;
  try {
    const valid = await verifyTxRequest({
      requestToken,
      wallet,
      appDomain: origin,
    });
    return !!valid;
  } catch (e) {
    return false;
  }
});

export const transactionRequestStxAddressState = atom(
  get => get(requestTokenPayloadState)?.stxAddress
);

export const transactionRequestNetwork = atom(get => get(requestTokenPayloadState)?.network);

requestTokenPayloadState.debugLabel = 'requestTokenPayloadState';
requestTokenOriginState.debugLabel = 'requestTokenOriginState';
transactionRequestValidationState.debugLabel = 'transactionRequestValidationState';
transactionRequestStxAddressState.debugLabel = 'transactionRequestStxAddressState';
transactionRequestNetwork.debugLabel = 'transactionRequestNetwork';
