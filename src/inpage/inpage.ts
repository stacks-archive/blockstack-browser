import { StacksProvider } from '@stacks/connect';
import {
  AuthenticationRequestEventDetails,
  DomEventName,
  TransactionRequestEventDetails,
} from '@inpage/inpage-types';
import {
  AuthenticationResponseMessage,
  ExternalMethods,
  MessageToContentScript,
  MESSAGE_SOURCE,
  TransactionResponseMessage,
} from '@content-scripts/message-types';

type CallableMethods = keyof typeof ExternalMethods;

interface ExtensionResponse {
  source: 'blockstack-extension';
  method: CallableMethods;

  [key: string]: any;
}

const callAndReceive = async (
  methodName: CallableMethods | 'getURL',
  opts: any = {}
): Promise<ExtensionResponse> => {
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
    return new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent<AuthenticationResponseMessage>) => {
        if (!isValidEvent(event, ExternalMethods.authenticationResponse)) return;
        if (event.data.payload?.authenticationRequest !== authenticationRequest) return;
        window.removeEventListener('message', handleMessage);
        if (event.data.payload.authenticationResponse === 'cancel') {
          reject(event.data.payload.authenticationResponse);
          return;
        }
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
    return new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent<TransactionResponseMessage>) => {
        if (!isValidEvent(event, ExternalMethods.transactionResponse)) return;
        if (event.data.payload?.transactionRequest !== transactionRequest) return;
        window.removeEventListener('message', handleMessage);
        if (event.data.payload.transactionResponse === 'cancel') {
          reject(event.data.payload.transactionResponse);
          return;
        }
        if (typeof event.data.payload.transactionResponse !== 'string') {
          resolve(event.data.payload.transactionResponse);
        }
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
