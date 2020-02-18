import { UserSession, AppConfig } from 'blockstack';
import './types';
import { popupCenter } from './popup';

const defaultAuthURL = 'https://app.blockstack.org';

export interface FinishedData {
  authResponse: string;
  userSession: UserSession;
}

export interface AuthOptions {
  // The URL you want the user to be redirected to after authentication.
  redirectTo?: string;
  manifestPath?: string;
  finished?: (payload: FinishedData) => void;
  authOrigin?: string;
  sendToSignIn?: boolean;
  userSession?: UserSession;
  appDetails: {
    name: string;
    icon: string;
  };
}

export const authenticate = async ({
  redirectTo = '/',
  manifestPath,
  finished,
  authOrigin,
  sendToSignIn = false,
  userSession,
  appDetails,
}: AuthOptions) => {
  if (!userSession) {
    const appConfig = new AppConfig(['store_write'], document.location.href);
    // eslint-disable-next-line no-param-reassign
    userSession = new UserSession({ appConfig });
  }
  if (userSession.isUserSignedIn()) {
    userSession.signUserOut();
  }
  const transitKey = userSession.generateAndStoreTransitKey();
  const authRequest = userSession.makeAuthRequest(
    transitKey,
    `${document.location.origin}${redirectTo}`,
    `${document.location.origin}${manifestPath}`,
    userSession.appConfig.scopes,
    undefined,
    undefined,
    {
      sendToSignIn,
      appDetails,
    }
  );

  const extensionURL = await window.BlockstackProvider?.getURL();
  const authURL = new URL(extensionURL || authOrigin || defaultAuthURL);
  const params = window.location.search
    .substr(1)
    .split('&')
    .filter(param => param.startsWith('utm'))
    .map(param => param.split('='));
  const urlParams = new URLSearchParams();
  params.forEach(([key, value]) => urlParams.set(key, value));
  urlParams.set('authRequest', authRequest);
  const popup = popupCenter({
    url: `${authURL.origin}/actions.html?${urlParams.toString()}`,
  });

  setupListener({ popup, authRequest, finished, authURL, userSession });
};

interface FinishedEventData {
  authResponse: string;
  authRequest: string;
  source: string;
}

interface ListenerParams {
  popup: Window | null;
  authRequest: string;
  finished?: (payload: FinishedData) => void;
  authURL: URL;
  userSession: UserSession;
}

const setupListener = ({ popup, authRequest, finished, authURL, userSession }: ListenerParams) => {
  const interval = setInterval(() => {
    if (popup) {
      try {
        popup.postMessage(
          {
            authRequest,
          },
          authURL.origin
        );
      } catch (error) {
        console.warn('[Blockstack] Unable to send ping to authentication service');
        clearInterval(interval);
      }
    }
  }, 100);

  const receiveMessage = async (event: MessageEvent) => {
    const data: FinishedEventData = event.data;
    if (data.authRequest === authRequest) {
      if (finished) {
        const { authResponse } = data;
        await userSession.handlePendingSignIn(authResponse);
        finished({
          authResponse,
          userSession,
        });
      }
      window.removeEventListener('message', receiveMessageCallback);
      clearInterval(interval);
    }
  };

  const receiveMessageCallback = (event: MessageEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    receiveMessage(event);
  };

  window.addEventListener('message', receiveMessageCallback, false);
};
