import { useRecoilState } from 'recoil';
import { loadingState } from '@store/recoil/loading';

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
