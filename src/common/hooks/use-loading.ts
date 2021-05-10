import { useRecoilState } from 'recoil';
import { loadingState } from '@store/loading';

export function useLoading(key: string) {
  const [state, setState] = useRecoilState(loadingState(key));

  const setIsLoading = () => setState(() => 'loading');
  const setIsIdle = () => setState(() => 'idle');

  const isLoading = state === 'loading';
  return {
    isLoading,
    setIsLoading,
    setIsIdle,
  };
}
