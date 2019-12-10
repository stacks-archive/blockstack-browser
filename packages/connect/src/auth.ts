import { UserSession, AppConfig } from 'blockstack';
import { popupCenter } from './popup';

const dataVaultHost = 'https://vault.hankstoever.com';
const dataVaultURL = new URL(dataVaultHost);

interface AuthOptions {
  // The URL you want the user to be redirected to after authentication.
  redirectTo: string;
  manifestPath: string;
  finished?: (data: any) => void;
  vaultUrl?: string;
  sendToSignIn?: boolean;
  appDetails?: {
    name: string;
    icon: string;
  };
}

export const authenticate = ({
  redirectTo,
  manifestPath,
  finished,
  vaultUrl,
  sendToSignIn = false,
  appDetails
}: AuthOptions) => {
  const dataVaultURL = new URL(vaultUrl || dataVaultHost);
  const appConfig = new AppConfig(
    ['store_write', 'publish_data'],
    document.location.href
  );
  const userSession = new UserSession({ appConfig });
  const authRequest = userSession.makeAuthRequest(
    undefined,
    `${document.location.origin}${redirectTo}`,
    `${document.location.origin}${manifestPath}`,
    undefined,
    undefined,
    undefined,
    {
      sendToSignIn,
      appDetails
    }
  );

  const height = 584;
  const width = 440;

  const popup = popupCenter(
    `${dataVaultURL.origin}/actions.html?authRequest=${authRequest}`,
    'Continue with Data Vault',
    width,
    height
  );

  setupListener({ popup, authRequest, finished });
};

interface ListenerParams {
  popup: Window | null;
  authRequest: string;
  finished?: (data: any) => void;
}

const setupListener = ({ popup, authRequest, finished }: ListenerParams) => {
  const interval = setInterval(() => {
    if (popup) {
      popup.postMessage(
        {
          hello: 'world',
          authRequest
        },
        dataVaultURL.origin
      );
    }
  }, 100);

  const receiveMessage = (event: MessageEvent) => {
    if (event.data.authRequest === authRequest) {
      console.log(event.data);
      console.log('finished!');
      if (finished) {
        finished(event.data);
      }
      window.removeEventListener('message', receiveMessage);
      clearInterval(interval);
    }
  };

  window.addEventListener('message', receiveMessage, false);
};
