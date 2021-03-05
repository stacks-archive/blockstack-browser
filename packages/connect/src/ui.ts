import { authenticate } from './auth';
import type { AuthOptions } from './types/auth';
import { defineCustomElements } from '@stacks/connect-ui';
import { getStacksProvider } from './utils';

export const showConnect = (authOptions: AuthOptions) => {
  if (getStacksProvider()) {
    void authenticate(authOptions);
    return;
  }
  defineCustomElements();
  const element = document.createElement('connect-modal');
  element.authOptions = authOptions;
  document.body.appendChild(element);
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
