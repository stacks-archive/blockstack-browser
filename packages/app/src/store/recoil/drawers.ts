import { atom } from 'recoil';

export enum AccountStep {
  Switch = 'switch',
  Create = 'create',
  Username = 'username',
}

export const accountDrawerStep = atom<AccountStep>({
  key: 'drawers.accounts.visibility',
  default: AccountStep.Switch,
});

export const showAccountsStore = atom({
  key: 'drawers.switch-account',
  default: false,
});

export const showNetworksStore = atom({
  key: 'drawers.show-networks',
  default: false,
});

export const showSettingsStore = atom({
  key: 'drawers.show-settings',
  default: false,
});
