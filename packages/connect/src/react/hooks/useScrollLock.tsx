// https://github.com/moldy530/react-use-scroll-lock/blob/master/src/use-scroll-lock.ts

import { useEffect, useState } from 'react';

declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    __useScrollLockStyle: string | undefined | null;
    __useScrollLockInstances: Set<{}> | undefined | null;
  }
}

// this is necessary because we may share instances of this file on a page so we store these globally
window.__useScrollLockInstances = window.__useScrollLockInstances || new Set<{}>();
const originalStyle = () => {
  window.__useScrollLockStyle = window.__useScrollLockStyle || window.getComputedStyle(document.body).overflow;

  return window.__useScrollLockStyle;
};
const instances: Set<{}> = window.__useScrollLockInstances;

const registerInstance = (instance: {}) => {
  if (instances.size === 0) {
    setBodyOverflow(true);
  }

  instances.add(instance);
};

const unregisterInstance = (instance: {}) => {
  instances.delete(instance);

  if (instances.size === 0) {
    setBodyOverflow(false);
  }
};

const setBodyOverflow = (shouldLock: boolean) => {
  if (shouldLock) {
    originalStyle();
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = originalStyle();
  }
};

export const useScrollLock = (shouldLock: boolean) => {
  // we generate a unique reference to the component that uses this thing
  const [elementId] = useState({});

  useEffect(() => {
    if (shouldLock) {
      registerInstance(elementId);
    }

    // Re-enable scrolling when component unmounts
    return () => unregisterInstance(elementId);
  }, [elementId, shouldLock]); // ensures effect is only run on mount, unmount, and on shouldLock change
};
