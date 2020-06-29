import React from 'react';
import { useSafeLayoutEffect } from '@blockstack/ui';

export const useLockBodyScroll = (lock: boolean) => {
  useSafeLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (lock) {
      if (document.body.style.overflow !== 'hidden') {
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (document.body.style.overflow !== originalStyle) {
        document.body.style.overflow = originalStyle;
      }
    }

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]); // Empty array ensures effect is only run on mount and unmount
};
