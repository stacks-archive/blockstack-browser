import { AtomEffect, DefaultValue } from 'recoil';

export const ATOM_LOCALSTORAGE_PREFIX = '__hiro-recoil-v2__';

export const localStorageKey = (atomKey: string): string => {
  return `${ATOM_LOCALSTORAGE_PREFIX}${atomKey}`;
};

interface LocalStorageTransformer<T> {
  serialize: (atom: T | DefaultValue) => string;
  deserialize: (serialized: string) => T;
}

export const guardRecoilDefaultValue = <T>(
  candidate: DefaultValue | T
): candidate is DefaultValue => {
  if (candidate instanceof DefaultValue) return true;
  return false;
};

interface LocalStorageEffectOptions<T> {
  transformer?: LocalStorageTransformer<T>;
}
export const localStorageEffect =
  <T>({ transformer }: LocalStorageEffectOptions<T> = {}): AtomEffect<T> =>
  ({ setSelf, onSet, node }) => {
    const key = localStorageKey(node.key);
    if (typeof window !== 'undefined') {
      const savedValue = localStorage.getItem(key);
      if (savedValue) {
        try {
          if (transformer) {
            setSelf(transformer.deserialize(savedValue));
          } else {
            window.requestAnimationFrame(() => {
              setSelf(JSON.parse(savedValue));
            });
          }
        } catch (error) {
          console.error(`Error when saving the recoil state ${key}.`, error);
          console.error('Recoil value:', savedValue);
        }
      }

      onSet(newValue => {
        if (transformer) {
          const serialized = transformer.serialize(newValue);
          if (serialized) {
            localStorage.setItem(key, serialized);
          } else {
            localStorage.removeItem(key);
          }
        } else {
          const doClear =
            guardRecoilDefaultValue(newValue) || newValue === null || newValue === undefined;
          if (doClear) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, JSON.stringify(newValue));
          }
        }
      });
    }
  };
