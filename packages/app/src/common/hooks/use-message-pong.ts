import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthRequest } from '@store/onboarding/selectors';
import { getEventSourceWindow } from '@common/utils';

export const useMessagePong = () => {
  const authRequest = useSelector(selectAuthRequest);
  const sendMessage = useCallback(
    (event: MessageEvent) => {
      if (event.data.method === 'ping') {
        const source = getEventSourceWindow(event);
        source?.postMessage(
          {
            method: 'pong',
            authRequest: event.data.authRequest,
            source: 'blockstack-app',
          },
          event.origin
        );
      }
    },
    [authRequest]
  );

  const deregister = () => {
    window.removeEventListener('message', sendMessage);
  };

  useEffect(() => {
    window.addEventListener('message', sendMessage);
    return deregister;
  }, []);
};
