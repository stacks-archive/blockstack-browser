import { DecodedAuthRequest } from '@dev/types';

export const getAuthRequestParam = () => {
  const { search } = document.location;
  const matches = /authRequest=(.*)&?/.exec(search);
  if (matches && matches.length === 2) {
    return matches[1];
  }
  return null;
};

export const authenticationInit = () => {
  const authRequest = getAuthRequestParam();
  if (authRequest) {
    return authRequest;
  } else {
    console.log('No auth request found');
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
 * It works by waiting for a cross-origin message from the origin app. It has to wait
 * for this message, because that origin created the popup originally, which is why it's allowed
 * to make the cross-origin message. Once we get that message, we are allowed to send a
 * message back to that origin.
 *
 * Using cross-origin messaging allows for a better UX, because the origin app can receive a callback
 * when authentication is done.
 *
 * If the cross-origin messaging fails for any reason, just fall back to the usual redirect method,
 * but using a new tab.
 *
 */
export const finalizeAuthResponse = ({ decodedAuthRequest, authRequest, authResponse }: FinalizeAuthParams) => {
  let didSendMessageBack = false;
  setTimeout(() => {
    if (!didSendMessageBack) {
      const redirect = `${decodedAuthRequest.redirect_uri}?authResponse=${authResponse}`;
      window.open(redirect);
    }
    window.close();
  }, 500);
  window.addEventListener('message', event => {
    if (authRequest && event.data.authRequest === authRequest) {
      const isWindow = !(event.source instanceof MessagePort) && !(event.source instanceof ServiceWorker);
      if (isWindow) {
        didSendMessageBack = true;
        (event.source as Window).postMessage(
          {
            authRequest,
            authResponse,
            source: 'blockstack-app',
          },
          event.origin
        );
      }
    }
  });
};
