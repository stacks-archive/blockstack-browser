import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Fathom from 'fathom-client';

export const useFathom = () => {
  const router = useRouter();

  useEffect(() => {
    // Initialize Fathom when the app loads
    Fathom.load(process.env.FATHOM_ID, {
      includedDomains: ['blockstack.design'],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a page view when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    // Un assign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, []);
};
