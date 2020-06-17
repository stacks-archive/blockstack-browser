import { UserSession, AppConfig } from 'blockstack';
import './types';
import { popupCenter, setupListener } from './popup';

export const defaultAuthURL = 'https://app.blockstack.org';

export interface FinishedData {
  authResponse: string;
  userSession: UserSession;
}

export interface AuthOptions {
  /** The URL you want the user to be redirected to after authentication. */
  redirectTo?: string;
  manifestPath?: string;
  /** DEPRECATED: use `onFinish` */
  finished?: (payload: FinishedData) => void;
  /**
   * This callback is fired after authentication is finished.
   * The callback is called with a single object argument, with two keys:
   * `userSession`: a UserSession object with `userData` included
   * `authResponse`: the raw `authResponse` string that is returned from authentication
   * */
  onFinish?: (payload: FinishedData) => void;
  /** This callback is fired if the user exits before finishing */
  onCancel?: () => void;
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
  onFinish,
  onCancel,
  authOrigin,
  sendToSignIn = false,
  userSession,
  appDetails,
}: AuthOptions) => {
  if (!userSession) {
    const appConfig = new AppConfig(['store_write'], document.location.href);
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

  const params = window.location.search
    .substr(1)
    .split('&')
    .filter(param => param.startsWith('utm'))
    .map(param => param.split('='));
  const urlParams = new URLSearchParams();
  params.forEach(([key, value]) => urlParams.set(key, value));
  urlParams.set('authRequest', authRequest);

  const path = sendToSignIn ? 'sign-in' : 'sign-up';

  const extensionURL = await window.BlockstackProvider?.getURL();
  const authURL = new URL(extensionURL || authOrigin || defaultAuthURL);

  const popup = popupCenter({
    url: `${authURL.origin}/index.html#/${path}?${urlParams.toString()}`,
    // If the extension is installed, dont worry about popup blocking
    // Otherwise, firefox will open the popup and a new tab.
    skipPopupFallback: !!window.BlockstackProvider,
  });

  setupAuthListener({
    popup,
    authRequest,
    onFinish: onFinish || finished,
    authURL,
    userSession,
    onCancel,
  });
};

interface FinishedEventData {
  authResponse: string;
  authRequest: string;
  source: string;
}

interface ListenerParams {
  popup: Window | null;
  authRequest: string;
  onFinish?: (payload: FinishedData) => void;
  onCancel?: () => void;
  authURL: URL;
  userSession: UserSession;
}

const setupAuthListener = ({
  popup,
  authRequest,
  onFinish,
  onCancel,
  authURL,
  userSession,
}: ListenerParams) => {
  setupListener<FinishedEventData>({
    popup,
    onCancel,
    onFinish: async (data: FinishedEventData) => {
      if (data.authRequest === authRequest) {
        if (onFinish) {
          const { authResponse } = data;
          await userSession.handlePendingSignIn(authResponse);
          onFinish({
            authResponse,
            userSession,
          });
        }
      }
    },
    messageParams: {
      authRequest,
    },
    authURL,
  });
};
