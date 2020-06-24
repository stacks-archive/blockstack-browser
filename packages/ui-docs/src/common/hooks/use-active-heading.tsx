import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppState } from '@common/hooks/use-app-state';

type ActiveHeadingReturn = [boolean, (value: string) => void, string];

export const useActiveHeading = (_slug: string): ActiveHeadingReturn => {
  const router = useRouter();
  const { asPath } = router;
  const { activeSlug, doChangeActiveSlug } = useAppState();
  const urlHash = asPath?.includes('#') && asPath.split('#')[1];
  const location = typeof window !== 'undefined' && window.location.href;

  useEffect(() => {
    if (urlHash && !activeSlug) {
      doChangeActiveSlug(urlHash);
    }
  }, [asPath, urlHash, location]);

  const isActive = _slug === activeSlug;

  return [isActive, doChangeActiveSlug, location];
};
