import { atomFamily, DefaultValue, AtomEffect, atom } from 'recoil';

export enum AccountStep {
  Switch = 'switch',
  Create = 'create',
  Username = 'username',
}

const localStorageEffect =
  (key: string): AtomEffect<number> =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet(newValue => {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };

export const tabState = atomFamily<number, string>({
  key: 'tabs',
  default: _param => 0,
  effects_UNSTABLE: param => [localStorageEffect(`TABS__${param}`)],
});

export const loadingState = atomFamily<'idle' | 'loading', string>({
  key: 'ui.loading',
  default: () => 'idle',
});

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
