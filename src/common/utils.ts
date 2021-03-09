import { DecodedAuthRequest } from './dev/types';
import { wordlists } from 'bip39';
import { FinishedTxPayload } from '@stacks/connect';
import { isValidUrl } from './validate-url';
import { getTab, deleteTabForRequest, StorageKey } from '@extension/storage';
import {
  AuthenticationResponseMessage,
  MESSAGE_SOURCE,
  Methods,
  TransactionResponseMessage,
} from '@extension/message-types';

export const getAuthRequestParam = () => {
  const { hash } = document.location;
  const matches = /authRequest=(.*)&?/.exec(hash);
  if (matches && matches.length === 2) {
    return matches[1];
  }
  return null;
};

export const authenticationInit = () => {
  const authRequest = getAuthRequestParam();
  return authRequest;
};

export const getEventSourceWindow = (event: MessageEvent) => {
  const isWindow =
    !(event.source instanceof MessagePort) && !(event.source instanceof ServiceWorker);
  if (isWindow) {
    return event.source as Window;
  }
  return null;
};

interface FinalizeAuthParams {
  decodedAuthRequest: DecodedAuthRequest;
  authResponse: string;
  authRequest: string;
}

/**
 * Call this function at the end of onboarding.
 *
 * We fetch the ID of the tab that originated this request from a data store.
 * Then, we send a message back to that tab, which is handled by the content script
 * of the extension.
 *
 */
export const finalizeAuthResponse = ({
  decodedAuthRequest,
  authRequest,
  authResponse,
}: FinalizeAuthParams) => {
  const dangerousUri = decodedAuthRequest.redirect_uri;
  if (!isValidUrl(dangerousUri)) {
    throw new Error('Cannot proceed with malicious url');
  }
  try {
    const tabId = getTab(StorageKey.authenticationRequests, authRequest);
    const responseMessage: AuthenticationResponseMessage = {
      source: MESSAGE_SOURCE,
      payload: {
        authenticationRequest: authRequest,
        authenticationResponse: authResponse,
      },
      method: Methods.authenticationResponse,
    };
    chrome.tabs.sendMessage(tabId, responseMessage);
    deleteTabForRequest(StorageKey.authenticationRequests, authRequest);
    window.close();
  } catch (error) {
    console.debug('Failed to get Tab ID for authentication request:', authRequest);
    throw new Error(
      'Your transaction was broadcasted, but we lost communication with the app you started with.'
    );
  }
};

export const finalizeTxSignature = (requestPayload: string, data: FinishedTxPayload) => {
  console.log(requestPayload, data);
  try {
    const tabId = getTab(StorageKey.transactionRequests, requestPayload);
    const responseMessage: TransactionResponseMessage = {
      source: MESSAGE_SOURCE,
      method: Methods.transactionResponse,
      payload: {
        transactionRequest: requestPayload,
        transactionResponse: data,
      },
    };
    chrome.tabs.sendMessage(tabId, responseMessage);
    deleteTabForRequest(StorageKey.transactionRequests, requestPayload);
    window.close();
  } catch (error) {
    console.debug('Failed to get Tab ID for transaction request:', requestPayload);
    throw new Error(
      'Your transaction was broadcasted, but we lost communication with the app you started with.'
    );
  }
};

export const getRandomWord = () => {
  const list = wordlists.EN;
  return list[Math.floor(Math.random() * list.length)];
};

export function stringToHslColor(str: string, saturation: number, lightness: number): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
