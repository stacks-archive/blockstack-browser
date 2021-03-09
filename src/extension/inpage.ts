import { StacksProvider } from '@stacks/connect';
import {
  AuthenticationRequestEventDetails,
  AuthenticationResponseMessage,
  DomEventName,
  Methods,
  MESSAGE_SOURCE,
  TransactionRequestEventDetails,
  MessageToContentScript,
  TransactionResponseMessage,
} from './message-types';

interface Response {
  source: 'blockstack-extension';
  method: string;
  [key: string]: any;
}

const callAndReceive = async (methodName: string, opts: any = {}): Promise<Response> => {
  return new Promise((resolve, reject) => {
    console.log(`BlockstackApp.${methodName}:`, opts);
    const timeout = setTimeout(() => {
      reject('Unable to get response from Blockstack extension');
    }, 1000);
    const waitForResponse = (event: MessageEvent) => {
      if (
        event.data.source === 'blockstack-extension' &&
        event.data.method === `${methodName}Response`
      ) {
        clearTimeout(timeout);
        window.removeEventListener('message', waitForResponse);
        resolve(event.data);
      }
    };
    window.addEventListener('message', waitForResponse);
    window.postMessage(
      {
        method: methodName,
        source: 'blockstack-app',
        ...opts,
      },
      window.location.origin
    );
  });
};

const isValidEvent = (event: MessageEvent, method: MessageToContentScript['method']) => {
  const { data } = event;
  const correctSource = data.source === MESSAGE_SOURCE;
  const correctMethod = data.method === method;
  return correctSource && correctMethod && !!data.payload;
};

const provider: StacksProvider = {
  getURL: async () => {
    const { url } = await callAndReceive('getURL');
    return url;
  },
  authenticationRequest: async authenticationRequest => {
    const event = new CustomEvent<AuthenticationRequestEventDetails>(
      DomEventName.authenticationRequest,
      {
        detail: { authenticationRequest },
      }
    );
    document.dispatchEvent(event);
    return new Promise(resolve => {
      const handleMessage = (event: MessageEvent<AuthenticationResponseMessage>) => {
        if (!isValidEvent(event, Methods.authenticationResponse)) return;
        if (event.data.payload?.authenticationRequest !== authenticationRequest) return;
        window.removeEventListener('message', handleMessage);
        resolve(event.data.payload.authenticationResponse);
      };
      window.addEventListener('message', handleMessage);
    });
  },
  transactionRequest: async transactionRequest => {
    const event = new CustomEvent<TransactionRequestEventDetails>(DomEventName.transactionRequest, {
      detail: { transactionRequest },
    });
    document.dispatchEvent(event);
    return new Promise(resolve => {
      const handleMessage = (event: MessageEvent<TransactionResponseMessage>) => {
        if (!isValidEvent(event, Methods.transactionResponse)) return;
        if (event.data.payload?.transactionRequest !== transactionRequest) return;
        window.removeEventListener('message', handleMessage);
        resolve(event.data.payload.transactionResponse);
      };
      window.addEventListener('message', handleMessage);
    });
  },
  getProductInfo() {
    return {
      version: VERSION,
      name: 'Stacks Wallet for Web',
      meta: {
        tag: BRANCH,
        commit: COMMIT_SHA,
      },
    };
  },
};

window.StacksProvider = provider;
window.BlockstackProvider = provider;
