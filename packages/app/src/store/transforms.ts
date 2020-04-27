import { Wallet } from '@blockstack/keychain';
import { createTransform } from 'redux-persist';
import { initialState } from '@store/onboarding/reducer';

interface OutboundState {
  [key: string]: any;
  currentWallet: null | Wallet;
}

export const WalletTransform = createTransform(
  inboundState => {
    return { ...inboundState };
  },
  (outboundState: OutboundState) => {
    if (outboundState.currentWallet) {
      const currentWallet = outboundState.currentWallet;
      const newWallet = new Wallet(currentWallet);
      return {
        ...outboundState,
        currentWallet: newWallet,
        identities: [...newWallet.identities],
      };
    }
    return {
      ...outboundState,
    };
  },
  { whitelist: ['wallet'] }
);

interface InboundOnboardingState {
  onboardingPath?: string;
}

/**
 * For the onboarding reducer, we only want to persist the 'onboarding path'.
 * This allows users to jump back into the step they left off on, if they close the onboarding window.
 */
export const OnboardingTransform = createTransform(
  (inboundState: InboundOnboardingState) => {
    return {
      onboardingPath: inboundState.onboardingPath,
      ...initialState,
      ...inboundState,
    };
  },
  outboundState => {
    return { ...outboundState };
  },
  { whitelist: ['onboarding'] }
);
