import * as React from 'react';
import { useSafeLayoutEffect } from '@blockstack/ui';

const isBrowser = typeof window !== 'undefined';

const isSupported = (api: string) => isBrowser && api in window;

/**
 * React hook that tracks state of a CSS media query
 *
 * @param query the media query to match
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(() => {
    if (!isSupported('matchMedia')) return false;
    return window.matchMedia(query).matches;
  });

  useSafeLayoutEffect(() => {
    if (!isSupported('matchMedia')) return;

    const mediaQueryList = window.matchMedia(query);
    const listener = () => setMatches(mediaQueryList.matches);

    mediaQueryList.addListener(listener);

    listener();

    return () => {
      mediaQueryList.removeListener(listener);
    };
  }, [query]);

  return [matches, setMatches] as const;
}
