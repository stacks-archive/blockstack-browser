import { AtomEffect, DefaultValue } from 'recoil';

export const ATOM_LOCALSTORAGE_PREFIX = '__hiro-recoil__';

export const localStorageKey = (atomKey: string): string => {
  return `${ATOM_LOCALSTORAGE_PREFIX}${atomKey}`;
};

interface LocalStorageTransformer<T> {
  serialize: (atom: T | DefaultValue) => string;
  deserialize: (serialized: string) => T;
}

interface LocalStorageEffectOptions<T> {
  transformer?: LocalStorageTransformer<T>;
  onlyExtension?: boolean;
}
export const localStorageEffect = <T>({
  transformer,
  onlyExtension,
}: LocalStorageEffectOptions<T> = {}): AtomEffect<T> => ({ setSelf, onSet, node }) => {
  if (onlyExtension && EXT_ENV === 'web' && NODE_ENV !== 'development') return;

  const key = localStorageKey(node.key);
  if (typeof window !== 'undefined') {
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      try {
        if (transformer) {
          setSelf(transformer.deserialize(savedValue));
        } else {
          setSelf(JSON.parse(savedValue));
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
        if (newValue !== null && newValue !== undefined) {
          localStorage.setItem(key, JSON.stringify(newValue));
        } else {
          localStorage.removeItem(key);
        }
      }
    });
  }
};
