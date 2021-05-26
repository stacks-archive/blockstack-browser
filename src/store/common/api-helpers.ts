import { atom, atomFamily } from 'recoil';

enum KEYS {
  REVALIDATION_INDEX = 'api/REVALIDATION_INDEX',
  INTERVAL = 'clients/INTERVAL',
}

export const apiRevalidation = atom({
  key: KEYS.REVALIDATION_INDEX,
  default: 0,
});

export const intervalState = atomFamily<number, number>({
  key: KEYS.INTERVAL,
  default: 0,
  effects_UNSTABLE: (intervalMilliseconds: number) => [
    ({ setSelf }) => {
      const interval = setInterval(() => {
        setSelf(current => {
          if (typeof current === 'number') {
            return current + 1;
          }
          return 1;
        });
      }, intervalMilliseconds);
      return () => {
        clearInterval(interval);
      };
    },
  ],
});
