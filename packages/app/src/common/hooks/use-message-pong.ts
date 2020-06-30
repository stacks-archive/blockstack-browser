import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthRequest } from '@store/onboarding/selectors';
import { getEventSourceWindow } from '@common/utils';

export const useMessagePong = () => {
  const authRequest = useSelector(selectAuthRequest);
  const sendMessage = (event: MessageEvent) => {
    console.log('internal event', event);
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
  };

  const deregister = () => {
    window.removeEventListener('message', sendMessage);
  };

  useEffect(() => {
    window.addEventListener('message', sendMessage);
    return deregister;
  }, [authRequest]);
};
