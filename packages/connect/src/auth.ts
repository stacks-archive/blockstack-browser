import { AppConfig, UserSession } from '@stacks/auth';
import type { AuthOptions } from './types';
import packageJson from '../package.json';
import { getStacksProvider } from './utils';

export const defaultAuthURL = 'https://app.blockstack.org';

if (typeof window !== 'undefined') {
  (window as any).__CONNECT_VERSION__ = packageJson.version;
}

export const isMobile = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) {
    return true;
  }
  if (/iPad|iPhone|iPod/.test(ua)) {
    return true;
  }
  if (/windows phone/i.test(ua)) {
    return true;
  }
  return false;
};

/**
 * mobile should not use a 'popup' type of window.
 */
export const shouldUsePopup = () => {
  return !isMobile();
};

export const getOrCreateUserSession = (userSession?: UserSession): UserSession => {
  if (!userSession) {
    const appConfig = new AppConfig(['store_write'], document.location.href);
    userSession = new UserSession({ appConfig });
  }
  return userSession;
};

export const authenticate = (authOptions: AuthOptions) => {
  const provider = getStacksProvider();
  if (!provider) {
    throw new Error('Unable to authenticate without Stacks Wallet extension');
  }

  const {
    redirectTo = '/',
    manifestPath,
    finished,
    onFinish,
    onCancel,
    sendToSignIn = false,
    userSession: _userSession,
    appDetails,
  } = authOptions;
  const userSession = getOrCreateUserSession(_userSession);
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
      connectVersion: packageJson.version,
    }
  );

  try {
    void provider.authenticationRequest(authRequest).then(async authResponse => {
      await userSession.handlePendingSignIn(authResponse);
      const success = onFinish || finished;
      success?.({
        authResponse,
        userSession,
      });
    });
  } catch (error) {
    onCancel?.(error);
  }
};

export const getUserData = async (userSession?: UserSession) => {
  userSession = getOrCreateUserSession(userSession);
  if (userSession.isUserSignedIn()) {
    return userSession.loadUserData();
  }
  if (userSession.isSignInPending()) {
    return userSession.handlePendingSignIn();
  }
  return null;
};
