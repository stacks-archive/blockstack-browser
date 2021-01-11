import { createTransform } from 'redux-persist';
import { initialState } from '@store/onboarding/reducer';

interface InboundOnboardingState {
  onboardingPath?: string;
  secretKey?: string;
}

/**
 * For the onboarding reducer, we only want to persist the 'onboarding path'.
 * This allows users to jump back into the step they left off on, if they close the onboarding window.
 */
export const OnboardingTransform = createTransform(
  (inboundState: InboundOnboardingState) => {
    const { secretKey, ...state } = inboundState;
    return {
      onboardingPath: inboundState.onboardingPath,
      ...initialState,
      ...state,
    };
  },
  outboundState => {
    return { ...outboundState };
  },
  { whitelist: ['onboarding'] }
);
