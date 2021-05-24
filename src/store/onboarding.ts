import { atom } from 'recoil';
import { ScreenPaths } from '@store/common/types';
import { DecodedAuthRequest } from '@common/dev/types';

export interface OnboardingState {
  screen: ScreenPaths;
  secretKey?: string;
  authRequest?: string;
  decodedAuthRequest?: DecodedAuthRequest;
  appName?: string;
  appIcon?: string;
  appURL?: URL;
  magicRecoveryCode?: string;
  username?: string;
  onboardingInProgress?: boolean;
  onboardingPath?: ScreenPaths;
}

export const magicRecoveryCodePasswordState = atom({
  key: 'seed.magic-recovery-code.password',
  default: '',
});

export const seedInputState = atom({
  key: 'seed.input',
  default: '',
});

export const seedInputErrorState = atom<string | undefined>({
  key: 'seed.input.error',
  default: undefined,
});

export const currentScreenState = atom<ScreenPaths>({
  key: 'onboarding.screen',
  default: ScreenPaths.GENERATION,
});

export const secretKeyState = atom({
  key: 'onboarding.secretKey',
  default: null,
});

export const magicRecoveryCodeState = atom<null | string>({
  key: 'onboarding.magicRecoveryCode',
  default: null,
});

export const onboardingProgressState = atom({
  key: 'onboarding.progress',
  default: false,
});

export const usernameState = atom({
  key: 'onboarding.username',
  default: null,
});
export const onboardingPathState = atom({
  key: 'onboarding.path',
  default: null,
});

interface AuthRequestState {
  authRequest?: string;
  decodedAuthRequest?: DecodedAuthRequest;
  appName?: string;
  appIcon?: string;
  appURL?: URL;
}

export const authRequestState = atom<AuthRequestState>({
  key: 'onboarding.authRequest',
  default: {
    authRequest: undefined,
    decodedAuthRequest: undefined,
    appName: undefined,
    appIcon: undefined,
    appURL: undefined,
  },
});
