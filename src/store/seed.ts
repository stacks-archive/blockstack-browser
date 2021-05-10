import { atom } from 'recoil';

export const magicRecoveryCodeState = atom({
  key: 'seed.magic-recovery-code',
  default: '',
});

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
