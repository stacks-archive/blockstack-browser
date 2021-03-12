import { useState } from 'react';

export function useLoading() {
  const [loadingState, setLoadingState] = useState<'idle' | 'loading'>('idle');

  const setIsLoading = () => setLoadingState(() => 'loading');
  const setIsIdle = () => setLoadingState(() => 'idle');

  const isLoading = loadingState === 'loading';
  return {
    isLoading,
    setIsLoading,
    setIsIdle,
  };
}
