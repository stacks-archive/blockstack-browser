import { atomFamily, DefaultValue, AtomEffect } from 'recoil';

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
