import { atom } from 'jotai';
import { atomWithDefault } from 'jotai/utils';

import { ScreenPaths } from '@common/types';
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

interface AuthRequestState {
  authRequest?: string;
  decodedAuthRequest?: DecodedAuthRequest;
  appName?: string;
  appIcon?: string;
  appURL?: URL;
}

export const magicRecoveryCodePasswordState = atom('');
export const seedInputState = atom('');
export const seedInputErrorState = atom<string | undefined>(undefined);
export const secretKeyState = atomWithDefault(() => null);
export const currentScreenState = atom<ScreenPaths>(ScreenPaths.GENERATION);
export const magicRecoveryCodeState = atomWithDefault<null | string>(() => null);
export const onboardingProgressState = atom(false);
export const usernameState = atomWithDefault(() => null);
export const onboardingPathState = atomWithDefault(() => null);
export const authRequestState = atom<AuthRequestState>({
  authRequest: undefined,
  decodedAuthRequest: undefined,
  appName: undefined,
  appIcon: undefined,
  appURL: undefined,
});

magicRecoveryCodePasswordState.debugLabel = 'magicRecoveryCodePasswordState';
seedInputState.debugLabel = 'seedInputState';
seedInputErrorState.debugLabel = 'seedInputErrorState';
secretKeyState.debugLabel = 'secretKeyState';
currentScreenState.debugLabel = 'currentScreenState';
magicRecoveryCodeState.debugLabel = 'magicRecoveryCodeState';
onboardingProgressState.debugLabel = 'onboardingProgressState';
usernameState.debugLabel = 'usernameState';
onboardingPathState.debugLabel = 'onboardingPathState';
authRequestState.debugLabel = 'authRequestState';
