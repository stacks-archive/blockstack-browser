import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppState } from '@common/hooks/use-app-state';

interface ActiveHeadingReturn {
  isActive: boolean;
  doChangeActiveSlug: (value: string) => void;
  location: string;
  slugInView?: string;
  doChangeSlugInView: (value: string) => void;
}

export const useActiveHeading = (_slug: string): ActiveHeadingReturn => {
  const router = useRouter();
  const { asPath } = router;
  const { activeSlug, slugInView, doChangeActiveSlug, doChangeSlugInView } = useAppState();
  const urlHash = asPath?.includes('#') && asPath.split('#')[1];
  const location = typeof window !== 'undefined' && window.location.href;

  useEffect(() => {
    if (urlHash && !activeSlug) {
      doChangeActiveSlug(urlHash);
    }
  }, [asPath, urlHash, location]);

  const isActive = _slug === activeSlug;

  return {
    isActive,
    doChangeActiveSlug,
    location,
    slugInView,
    doChangeSlugInView,
  };
};
