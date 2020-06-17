import { BlockstackProvider } from '@blockstack/connect';

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

const provider: BlockstackProvider = {
  getURL: async () => {
    const { url } = await callAndReceive('getURL');
    return url;
  },
};

window.BlockstackProvider = provider;
