import { atom, PrimitiveAtom } from 'jotai';

const event = 'popstate';

type ParamType = string | null;

export function atomWithParam(key: string, initialValue: ParamType): PrimitiveAtom<ParamType> {
  const anAtom: PrimitiveAtom<ParamType> = atom<ParamType, any>(
    initialValue,
    (get, set, update: ParamType | ((prev: ParamType) => ParamType)) => {
      const newValue =
        typeof update === 'function'
          ? (update as (prev: ParamType) => ParamType)(get(anAtom))
          : update;
      set(anAtom, newValue);
      const searchParams = new URLSearchParams(location.hash.slice(2));
      if (newValue) searchParams.set(key, newValue);
      if (newValue === null) searchParams.delete(key);
      const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      history.pushState(null, '', newRelativePathQuery);
    }
  );
  anAtom.onMount = setAtom => {
    const callback = () => {
      const searchParams = new URLSearchParams(location.hash.slice(2));
      const str = searchParams.get(key);
      if (str !== null) {
        setAtom(str);
      }
    };
    window.addEventListener(event, callback);
    callback();
    return () => {
      window.removeEventListener(event, callback);
    };
  };
  return anAtom;
}
