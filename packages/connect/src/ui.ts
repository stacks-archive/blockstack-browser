import { authenticate, AuthOptions, FinishedData } from './auth';
import { defineCustomElements } from '@stacks/connect-ui';

export const showConnect = (authOptions: AuthOptions) => {
  defineCustomElements();
  const element = document.createElement('connect-modal');
  element.authOptions = authOptions;
  document.body.appendChild(element);
  const finishedWrapper = (finishedData: FinishedData) => {
    element.remove();
    const callback = authOptions.onFinish || authOptions.finished;
    if (callback) {
      callback(finishedData);
    }
  };
  element.addEventListener('onSignUp', () => {
    authenticate({
      ...authOptions,
      sendToSignIn: false,
      onFinish: finishedWrapper,
    });
  });
  element.addEventListener('onSignIn', () => {
    authenticate({
      ...authOptions,
      sendToSignIn: true,
      onFinish: finishedWrapper,
    });
  });
  const handleEsc = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      document.removeEventListener('keydown', handleEsc);
      element.remove();
    }
  };
  element.addEventListener('onCloseModal', () => {
    document.removeEventListener('keydown', handleEsc);
    element.remove();
  });
  document.addEventListener('keydown', handleEsc);
};

/**
 * @deprecated Use the renamed `showConnect` method
 */
export const showBlockstackConnect = (authOptions: AuthOptions) => showConnect(authOptions);
