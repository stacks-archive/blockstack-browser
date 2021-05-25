import { useRecoilSnapshot } from 'recoil';
import { useEffect } from 'react';

export function DebugObserver() {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !!localStorage.getItem('DEBUG')) {
      for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
        console.group(`[state change] ${node.key}`);
        console.log(snapshot.getLoadable(node).contents);
        console.groupEnd();
      }
    }
  }, [snapshot]);

  return null;
}
